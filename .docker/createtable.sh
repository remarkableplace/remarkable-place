#!/bin/bash -e

json="$(yaml json write ./serverless.yml)"
dynamodbEndpoint="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

for RESOURCE_NAME in "$@"
do
  tableName="$(echo $RESOURCE_NAME | sed 's/\([A-Z]\)/ \1/g' | awk '{print tolower($1);}')"
  echo "Create $tableName"
  aws dynamodb describe-table --table-name $tableName \
    --endpoint-url $dynamodbEndpoint || aws dynamodb create-table \
    --cli-input-json "$(node -pe "JSON.stringify(Object.assign(JSON.parse(process.argv[1]).resources.Resources.$RESOURCE_NAME.Properties, { TableName: '$tableName' }))" "$json")" \
    --endpoint-url $dynamodbEndpoint || echo "table $tableName already existed"
done
