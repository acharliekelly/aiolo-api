#!/bin/bash

API="http://localhost:4741"
URL_PATH="/artists-f"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "artist": {
      "name": "'"${NAME}"'",
      "living": "true",
      "birthYear": '${BORN}',
      "bio": "'"${BIO}"'",
      "gender": "'"${GENDER}"'",
      "nationality": "'"${NATIONALITY}"'"
    }
  }'

echo
