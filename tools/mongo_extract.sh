#!/bin/bash

# SET VARIABLES
DATABASE="${MONGO_DATABASE:-database}"
EXPORT_DATABASE="${MONGO_EXPORT_DATABASE:-dataExports}"
PORT="${MONGO_PORT:-27018}"
USERNAME="${MONGO_USERNAME:-admin}"
PASSWORD="${MONGO_PASSWORD:-password}"


# CD TO ROOT AND SET OUTPUT DIR
data_dir=$( cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. ; pwd -P )/data

auth_flags="--port=${PORT} --username=${USERNAME} --password=${PASSWORD} --authenticationDatabase=admin"


# CREATE AND PROVIDION EXPORTS COLLECTIONS
mongosh --host 127.0.0.1 --port ${PORT} --username ${USERNAME} --password ${PASSWORD} --authenticationDatabase admin ${DATABASE} ./tools/db_scripts/scene_aggregation.js

mongosh --host 127.0.0.1 --port ${PORT} --username ${USERNAME} --password ${PASSWORD} --authenticationDatabase admin ${EXPORT_DATABASE} ./tools/db_scripts/action_aggregation.js

# EXPORTS

# Users export
mongoexport ${auth_flags} --db=${DATABASE} --collection=users --type=csv --fieldFile=tools/collection_fields/user.txt --out=${data_dir}/users.csv

# Stories export
mongoexport ${auth_flags} --db=${DATABASE} --collection=stories --type=csv --fieldFile=tools/collection_fields/story.txt --out=${data_dir}/stories.csv

# Scenes export
mongoexport ${auth_flags} --db=${EXPORT_DATABASE} --collection=aggregatedScenes --type=csv --fieldFile=tools/collection_fields/scene.txt --out=${data_dir}/scenes.csv

# Actions export
mongoexport ${auth_flags} --db=${EXPORT_DATABASE} --collection=aggregatedActions --type=csv --fieldFile=tools/collection_fields/action.txt --out=${data_dir}/actions.csv

# Story progresses export
mongoexport ${auth_flags} --db=${DATABASE} --collection=story_progresses --type=csv --fieldFile=tools/collection_fields/story.txt --out=${data_dir}/story_progresses.csv
