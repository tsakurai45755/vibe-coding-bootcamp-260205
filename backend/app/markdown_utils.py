from __future__ import annotations

REQUIRED_HEADINGS: list[str] = [
    "## 作業内容",
    "## 進捗状況",
    "## 課題・問題点",
]


def strip_code_fences(text: str) -> str:
    """Strip surrounding markdown code fences if present."""

    s = text.strip()
    if s.startswith("```") and s.endswith("```"):
        lines = s.splitlines()
        if len(lines) >= 2 and lines[0].startswith("```"):
            inner = "\n".join(lines[1:-1])
            return inner.strip()
    return s


def ensure_required_headings(markdown: str) -> str:
    """Ensure the report contains the required 3-section headings.

    If a heading is missing, append it with a placeholder line.
    """

    normalized = strip_code_fences(markdown)
    out = normalized
    for heading in REQUIRED_HEADINGS:
        if heading not in out:
            out = out.rstrip() + "\n\n" + heading + "\n" + "- 不明（画像から読み取れず）"

    return out.strip() + "\n"
