#!/bin/bash
# PARAMS:
#   ID
#   NAME
#   TAG
#   DESCR
#   THUMBNAIL
#   SORTFIELD
#   SORTDESC
#   TOKEN


API="http://localhost:4741"
URL_PATH="/galleries"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
--data '{
    "gallery": {
      "name": "'"${NAME}"'",
      "tag": "'"${TAG}"'",
      "description": "'"${DESCR}"'",
      "thumbnail": "'"${THUMBNAIL}"'",
      "sortBy": {
        "field": "'"${SORTFIELD}"'",
        "descending": "'"${SORTDESC}"'"
      }
    }
  }'

echo
