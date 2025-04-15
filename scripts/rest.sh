#!/bin/bash
set -e

# workaround for https://github.com/anymaniax/orval/issues/171
orval && sed -e "s,'',',g" src/api/v3/directory.ts > tmpfile &&  mv tmpfile src/api/v3/directory.ts && eslint --fix src/api/v3/directory.ts src/types/directory --max-warnings=0
