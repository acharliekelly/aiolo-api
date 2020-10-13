#!/bin/bash
#PARAMS
# ID
# PUBLICID  STR
# WIDTH     INT
# HEIGHT    INT
# CREATED   D
# TOKEN

API="http://localhost:4741"
URL_PATH="/images"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "publicId": "'"${PUBLICID}"'",
    "width": '${WIDTH}',
    "height": '${HEIGHT}',
    "created_at": "'"${CREATED}"'"
  }'

echo
