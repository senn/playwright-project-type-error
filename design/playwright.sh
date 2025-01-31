#!/usr/bin/env bash

set -euo pipefail

echo "Running playwright"
eval ENVIRONMENT=LOCAL npx playwright test "$@"

exit 0
