#!/bin/sh
#PARAMS
# TAGNAME

API="http://localhost:4741"
URL_PATH="/gallery"

curl "${API}${URL_PATH}/${TAGNAME}" \
  --include \
  --request GET

echo