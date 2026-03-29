import re

from app.ai.llm_engine import LLMEngine
from app.ai.prompt_templates import build_cognitive_analysis_messages
from app.models.test import Test
from app.schemas.evaluation import CognitiveAnalysisResult


class CognitiveEngine:
    def __init__(self) -> None:
        self.llm_engine = LLMEngine()

    def analyze(self, test: Test, answer_text: str) -> CognitiveAnalysisResult:
        normalized_answer = (answer_text or "").strip()
        if not normalized_answer:
            return CognitiveAnalysisResult(
                understanding=False,
                concept=False,
                method=False,
                execution={"algebra": False, "trigonometry": False, "integration": False, "units": False},
                memory=False,
                error_reason="No answer text available for evaluation.",
            )

        if self.llm_engine.configured:
            system_prompt, user_prompt = build_cognitive_analysis_messages(test, normalized_answer)
            payload = self.llm_engine.complete_json(system_prompt=system_prompt, user_prompt=user_prompt)
            payload.setdefault("execution", {})
            payload["execution"] = {
                "algebra": bool(payload["execution"].get("algebra", False)),
                "trigonometry": bool(payload["execution"].get("trigonometry", False)),
                "integration": bool(payload["execution"].get("integration", False)),
                "units": bool(payload["execution"].get("units", False)),
            }
            payload.setdefault("error_reason", "")
            return CognitiveAnalysisResult.model_validate(payload)

        return self._heuristic_analysis(test, normalized_answer)

    def _heuristic_analysis(self, test: Test, answer_text: str) -> CognitiveAnalysisResult:
        lowered = answer_text.lower()
        concepts = [item.lower() for question in test.questions for item in question.concepts]
        steps = [item.lower() for question in test.questions for item in question.steps]
        calculations = [item.lower() for question in test.questions for item in question.calculation_types]

        concept_matches = sum(1 for concept in concepts if concept and concept in lowered)
        step_matches = sum(1 for step in steps if step and step in lowered)
        numeric_tokens = re.findall(r"\d+", lowered)

        execution = {
            "algebra": any(keyword in lowered for keyword in ("equation", "solve", "algebra")),
            "trigonometry": any(keyword in lowered for keyword in ("sin", "cos", "tan", "trigonometry")),
            "integration": any(keyword in lowered for keyword in ("integral", "differentiate", "integration")),
            "units": any(keyword in lowered for keyword in ("cm", "m", "kg", "unit", "seconds")),
        }

        understanding = concept_matches > 0 or step_matches > 0
        concept = concept_matches >= max(1, len(concepts) // 3) if concepts else len(answer_text) > 20
        method = step_matches >= max(1, len(steps) // 3) if steps else len(numeric_tokens) > 0
        memory = len(answer_text.split()) > 8 or len(calculations) > 0

        return CognitiveAnalysisResult(
            understanding=understanding,
            concept=concept,
            method=method,
            execution=execution,
            memory=memory,
            error_reason="Heuristic fallback used because OpenAI API key is not configured.",
        )
