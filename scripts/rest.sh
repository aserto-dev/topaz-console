#!/bin/bash
set -e

# workaround for https://github.com/anymaniax/orval/issues/171
orval --config orval-directory.config.ts && sed -e "s,'',',g" src/api/v3/directory.ts > tmpfile &&  mv tmpfile src/api/v3/directory.ts
