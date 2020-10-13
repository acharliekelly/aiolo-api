#!/bin/bash
#PARAMS
# ID

API="http://localhost:4741"
URL_PATH="/artwork"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \

echo
