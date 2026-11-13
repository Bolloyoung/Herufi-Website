"""Replace literal control and invisible characters in source files with \\uXXXX escapes.

Usage: python3 scripts/fix-invisible-chars.py <file> [<file> ...]
"""
import sys

BAD = {0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF, 0x2028, 0x2029}


def is_bad(ch: str) -> bool:
    o = ord(ch)
    return (o < 32 and ch not in "\n\r\t") or 0x7F <= o <= 0x9F or o in BAD


for path in sys.argv[1:]:
    text = open(path, encoding="utf-8").read()
    fixed = "".join("\\u%04X" % ord(c) if is_bad(c) else c for c in text)
    if fixed != text:
        open(path, "w", encoding="utf-8").write(fixed)
        print("fixed", path)
