#!/bin/bash
#PARAMS
# PUBLICID  STR
# HOSTID    ID
# WIDTH     INT
# HEIGHT    INT
# CREATED   D
# TOKEN

API="http://localhost:4741"
URL_PATH="/images"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "publicId": "'"${PUBLICID}"'",
    "host": "'"${HOSTID}"'",
    "width": '${WIDTH}',
    "height": '${HEIGHT}',
    "created_at": "'"${CREATED}"'"
    
  }'

echo
