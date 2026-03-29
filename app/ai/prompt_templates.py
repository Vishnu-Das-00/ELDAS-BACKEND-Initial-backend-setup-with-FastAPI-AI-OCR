from app.models.test import Test


def build_cognitive_analysis_messages(test: Test, answer_text: str) -> tuple[str, str]:
    system_prompt = (
        "You are an educational evaluator. Analyze how well a student's answer reflects "
        "understanding, concept knowledge, method selection, execution quality, and memory recall. "
        "Return JSON only."
    )
    question_blocks = []
    for question in test.questions:
        question_blocks.append(
            "\n".join(
                [
                    f"Question ID: {question.id}",
                    f"Text: {question.text}",
                    f"Subject: {question.subject}",
                    f"Chapter: {question.chapter}",
                    f"Concepts: {question.concepts}",
                    f"Steps: {question.steps}",
                    f"Calculation Types: {question.calculation_types}",
                ]
            )
        )
    questions_block = "\n\n".join(question_blocks)
    user_prompt = (
        f"Test subject: {test.subject}\n"
        f"Test chapter: {test.chapter}\n"
        f"Questions:\n{questions_block}\n\n"
        f"Student answer:\n{answer_text}\n\n"
        "Return a JSON object with this exact schema:\n"
        "{"
        '"understanding": true/false, '
        '"concept": true/false, '
        '"method": true/false, '
        '"execution": {"algebra": true/false, "trigonometry": true/false, "integration": true/false, "units": true/false}, '
        '"memory": true/false, '
        '"error_reason": ""'
        "}"
    )
    return system_prompt, user_prompt
