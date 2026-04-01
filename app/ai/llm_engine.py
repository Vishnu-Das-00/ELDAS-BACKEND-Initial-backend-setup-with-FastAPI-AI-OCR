import json

try:
    from openai import OpenAI
except ModuleNotFoundError:  # pragma: no cover - optional dependency when API access is disabled
    OpenAI = None

from app.core.config import get_settings


class LLMEngine:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key) if self.settings.openai_api_key and OpenAI is not None else None

    @property
    def configured(self) -> bool:
        return self.client is not None

    def complete_json(self, *, system_prompt: str, user_prompt: str) -> dict:
        if self.client is None:
            raise RuntimeError("OpenAI API key is not configured.")

        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            temperature=0,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        content = response.choices[0].message.content or "{}"
        return json.loads(content)
