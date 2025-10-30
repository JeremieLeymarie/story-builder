#!/usr/bin/env zsh

uv run dmypy restart
uv run dmypy check .

find app/**/*.py | entr -c -s "uv run dmypy recheck"
