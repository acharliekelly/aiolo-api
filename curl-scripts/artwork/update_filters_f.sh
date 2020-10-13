#!/bin/bash
#PARAMS
# IMAGEID  ID
# FLTR_SUBJ   ID
# FLTR_LOC    ID
# FLTR_STYLE  ID
# FLTR_SEASON ID
# FLTR_PERIOD ID
# FLTR_MEDIUM ID
# FLTR_ALBUM  ID

API="http://localhost:4741"
URL_PATH="/artwork-f"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--data '{
  "artwork": {
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