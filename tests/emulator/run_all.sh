#!/usr/bin/env bash
# Runs every emulator test; exits non-zero if any test fails.
set -u
cd "$(dirname "$0")"
failed=()
for t in test_*.py; do
  echo "== $t"
  python3 "$t" || failed+=("$t")
done
if [ ${#failed[@]} -gt 0 ]; then echo "FAILED: ${failed[*]}"; exit 1; fi
echo "ALL PASSED"
