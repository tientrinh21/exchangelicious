import re
import os
import uuid
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv

# Loads the variables in the .env file so we can access them
load_dotenv()

# Define your database configuration
config = {
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_SERVER'),
    'database': os.getenv('DB_NAME')
}

# Define the path to your Markdown file
markdown_file_path = 'usa-houston.md'
info_page_id = str(uuid.uuid4())

# Function to extract URL and texts under each Heading 1
def extract_info(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    # Extract the URL from the top of the file
    url_pattern = re.compile(r'https?://[^\s]+')
    url = None
    for line in lines:
        match = url_pattern.search(line)
        if match:
            url = match.group(0)
            break

    # Extract texts under each Heading 1
    heading1_indices = [i for i, line in enumerate(lines) if line.startswith('# ')]
    headings = []
    for i in range(len(heading1_indices)):
        start = heading1_indices[i] + 1  # Start after the heading
        end = heading1_indices[i + 1] if i + 1 < len(heading1_indices) else len(lines)
        heading_text = ''.join(lines[start:end]).strip()
        headings.append(heading_text)

    return url, headings

# Function to insert information into MySQL table
def insert_info_into_mysql(url, headings):
    if len(headings) != 10:
        print("The Markdown file does not have exactly ten Heading 1 sections.")
        return

    try:
        # Connect to MySQL database
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        # Insert the ID, URL and headings into info_page_table
        add_info = ("INSERT INTO info_page_table (info_page_id, webpage, introduction, location, semester, application_deadline, courses, housing, tuition, visa, eligibility, requirements) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        cursor.execute(add_info, (info_page_id, url, headings[0], headings[1], headings[2], headings[3], headings[4], headings[5], headings[6], headings[7], headings[8], headings[9]))

        # Commit the transaction
        cnx.commit()

        # Close the cursor and connection
        cursor.close()
        cnx.close()

        print("Information inserted successfully.")

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        cnx.close()

# Main script
if __name__ == "__main__":
    url, headings = extract_info(markdown_file_path)
    if url and headings:
        insert_info_into_mysql(url, headings)
    else:
        print("Failed to extract URL or headings from the Markdown file.")