#!/bin/sh

API="http://localhost:4741"
URL_PATH="/imageLookup"

curl "${API}${URL_PATH}/${PUBLICID}" \
  --include \
  --request GET

echo
