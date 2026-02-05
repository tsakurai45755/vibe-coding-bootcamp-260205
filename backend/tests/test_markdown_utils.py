from __future__ import annotations

from app.markdown_utils import ensure_required_headings


def test_ensure_required_headings_appends_missing_sections() -> None:
    src = "## 作業内容\n- a\n"
    out = ensure_required_headings(src)
    assert "## 作業内容" in out
    assert "## 進捗状況" in out
    assert "## 課題・問題点" in out


def test_strip_code_fences_is_handled() -> None:
    src = "```\n## 作業内容\n- a\n```"
    out = ensure_required_headings(src)
    assert out.startswith("## 作業内容")
