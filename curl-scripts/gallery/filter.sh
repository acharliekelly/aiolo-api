#!/bin/sh

API="http://localhost:4741"
URL_PATH="/filters"

curl "${API}${URL_PATH}/${FILTER}" \
  --include \
  --request GET

echo