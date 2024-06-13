#!/bin/bash

ENV_FILE_PATH="server/.env"

# Load environment variables from the .env file
if [ -f "$ENV_FILE_PATH" ]; then
	export $(cat $ENV_FILE_PATH | grep -v '^#' | xargs)
else
	echo ".env file not found!"
	exit 1
fi

# Check if required environment variables are set
if [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ]; then
	echo "One or more required environment variables are missing!"
	exit 1
fi

# Function to execute a SQL file
execute_sql_file() {
	local sql_file=$1
	echo "Executing $sql_file..."
	mysql -u$DB_USERNAME -p$DB_PASSWORD <$sql_file

	if [ $? -eq 0 ]; then
		echo "SQL script $sql_file executed successfully!"
	else
		echo "Error executing SQL script $sql_file!"
		exit 1
	fi
}

# Run the setup - the paths may be different on a different computer
execute_sql_file ./server/database_schemas/countries.sql
source ./server/.venv/bin/activate
python ./uni-data/ranking/rank.py
execute_sql_file ./server/database_schemas/schema.sql
deactivate
