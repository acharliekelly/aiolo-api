#!/bin/bash
#PARAMS
# IMAGEID  ID
# PUBLICID   STR
# TITLE   STR
# DESCRIP   STR
# MEDIUM    STR
# SURFACE   STR
# COMPLETED D
# WIDTH   INT
# HEIGHT  INT
# LOC    STR
# LAT   FLOAT
# LNG   FLOAT
# ARTISTID  ID

API="http://localhost:4741"
URL_PATH="/artwork-f"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "artwork": {
      "image": '${IMAGEID}',
      "publicId": "'"${PUBLICID}"'",
      "title": "'"${TITLE}"'",
      "description": "'"${DESCRIP}"'",
      "medium": "'"${MEDIUM}"'",
      "surface": "'"${SURFACE}"'",
      "completed": "'"${COMPLETED}"'",
      "dimensions": {
        "width": '${WIDTH}',
        "height": '${HEIGHT}',
      }
      "location": {
        "place": "'"${LOC}"'",
        "lat": '${LAT}',
        "lng": '${LNG}',
      },
      "artist": '${ARTISTID}'
    }
  }'

echo
