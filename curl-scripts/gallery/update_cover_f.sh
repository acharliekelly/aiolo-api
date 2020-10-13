#!/bin/bash
# PARAMS:
#   ID
#   COVER_ID


API="http://localhost:4741"
URL_PATH="/galleries-f"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--data '{
    "gallery": {
      "coverImage": "'"${COVER_ID}"'"
    }
  }'

echo
