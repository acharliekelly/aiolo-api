#!/bin/bash
#PARAMS
# JSONFILE  FILE
# TOKEN

API="http://localhost:4741"
URL_PATH="/artwork-f"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data @${JSONFILE}

echo
