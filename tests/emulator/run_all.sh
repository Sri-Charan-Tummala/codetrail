#!/usr/bin/env bash
# Runs every emulator test and prints what each one checked.
set -u
cd "$(dirname "$0")"
for t in test_*.py; do echo "== $t"; python3 "$t" || echo "FAILED: $t"; done
