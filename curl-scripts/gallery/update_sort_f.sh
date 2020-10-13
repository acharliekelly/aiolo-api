#!/bin/bash
# PARAMS:
#   ID
#   SORTFIELD
#   SORTDESC

API="http://localhost:4741"
URL_PATH="/galleries-f"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--data '{
    "gallery": {
      "sortBy": {
        "field": "'"${SORTFIELD}"'",
        "descending": "'"${SORTDESC}"'"
      }
    }
  }'

echo
