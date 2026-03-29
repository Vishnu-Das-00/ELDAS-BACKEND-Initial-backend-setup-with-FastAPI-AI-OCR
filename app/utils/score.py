from collections.abc import Iterable


def bool_to_score(value: bool | None) -> float:
    return 1.0 if value else 0.0


def calculate_overall_score(
    understanding: bool,
    concept: bool,
    method: bool,
    execution: dict[str, bool],
    memory: bool,
) -> float:
    execution_scores = [bool_to_score(item) for item in execution.values()]
    all_scores = [
        bool_to_score(understanding),
        bool_to_score(concept),
        bool_to_score(method),
        *execution_scores,
        bool_to_score(memory),
    ]
    return round(sum(all_scores) / len(all_scores), 4)


def average(values: Iterable[float]) -> float:
    values = list(values)
    if not values:
        return 0.0
    return round(sum(values) / len(values), 4)
