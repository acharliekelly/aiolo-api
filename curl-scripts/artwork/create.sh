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
# LOC_DESC  STR
# LAT   FLOAT
# LNG   FLOAT
# ARTISTID  ID
# FLTR_SUBJ   ID
# FLTR_LOC    ID
# FLTR_STYLE  ID
# FLTR_SEASON ID
# FLTR_PERIOD ID
# FLTR_MEDIUM ID
# FLTR_ALBUM  ID
# TOKEN

API="http://localhost:4741"
URL_PATH="/artwork"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
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
      "artist": '${ARTISTID}',
      "tags": [],
      "filters": {
        "subject": '${FLTR_SUBJ}',
        "location": '${FLTR_LOC}',
        "style": '${FLTR_STYLE}',
        "season": '${FLTR_SEASON}',
        "period": '${FLTR_PERIOD}',
        "medium": '${FLTR_MEDIUM}',
        "album": '${FLTR_ALBUM}'
      }
    }
  }'

echo
