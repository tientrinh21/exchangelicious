import re
import os
import uuid
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
from pathlib import Path
import pandas as pd

# Loads the variables in the .env file so we can access them
load_dotenv()

# Define your database configuration
config = {
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_SERVER'),
    'port':  os.getenv("DB_PORT"),
    'database': os.getenv('DB_NAME')
}

# print(config)

# Define the path to your Markdown file
markdown_file_path = 'usa-houston.md'

# Function to extract URL and texts under each Heading 1
def extract_info(file_path):
    with open(file_path, 'r', encoding="utf8") as file:
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
    # ignore this for now
    if "Supported Major" in [str(head).strip() for head in heading1_indices]:
        heading1_indices.remove("Supported Major")
        print("Removed supported major")
    else:
        print("No heading to remove")
    headings = []
    for i in range(len(heading1_indices)):
        start = heading1_indices[i] + 1  # Start after the heading
        end = heading1_indices[i + 1] if i + 1 < len(heading1_indices) else len(lines)
        heading_text = ''.join(lines[start:end]).strip()
        # print(heading_text)
        headings.append(heading_text)

    return url, headings

# Function to insert information into MySQL table
def insert_info_into_mysql(filename, url, headings):
    if len(headings) != 10 and len(headings) != 11:
        print("The Markdown file does not have exactly ten Heading 1 sections.")
        return

    try:
        # Connect to MySQL database
        cnx = mysql.connector.connect(**config, charset='utf8')
        cursor = cnx.cursor()

        # Insert the ID, URL and headings into info_page_table
        add_info = ("INSERT INTO info_page_table (info_page_id, webpage, introduction, location, semester, application_deadline, courses, housing, tuition, visa, eligibility, requirements) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        cursor.execute(add_info, (filename, url, headings[0], headings[1], headings[2], headings[3], headings[4], headings[5], headings[6], headings[7], headings[8], headings[9]))

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
    finally:
        cnx.close()

def run(path_to_folder):
    files = Path(path_to_folder).glob("*.md")
    print(files)
    for file in files:
        print(file)
        filename = file.name.split("\\")[0].split(".")[0].replace("-", "")
        url, headings = extract_info(file)
        # id = str(uuid.uuid4)
        if url and headings:
            insert_info_into_mysql(filename, url, headings)
        else:
            print("Failed to extract URL or headings from the Markdown file.")

# Functions for making the metadata table
def insert_summary_uni(filepath):
    abs_path = Path(filepath).absolute()
    df = pd.read_csv(abs_path, header="infer", sep=",", keep_default_na=False, na_values=['_'], encoding='utf8')
    df = df.reset_index()  # make sure indexes pair with number of rows

    print(df.iloc[0])
    print(df.columns)

    try:
        # Connect to MySQL database
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        for index, row in df.iterrows():
            print(row["long_name"])
            # Insert the ID, URL and headings into info_page_table
            add_info = ("INSERT INTO university_table (university_id, long_name, country_code, region, info_page_id, campus, housing, ranking) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")
            # cursor.execute(add_info, (str(uuid.uuid4), "name", "code", "region", "id", "camps", 0, "200"))
            cursor.execute(add_info, (row["university_id"], row["long_name"], row["country_code"],row["region"],str(row["info_page_id"]).replace("-", ""),row["campus"],row["housing"],"None"))
            
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
    finally:
        cnx.close()

# Main script
if __name__ == "__main__":
    # Run this first
    run("./uni-data/data")
    # Run this after the above succeeded completely 
    insert_summary_uni("./uni-data/university_table.csv")
    # print(config)
    # url, headings = extract_info(markdown_file_path)
    # if url and headings:
    #     insert_info_into_mysql(url, headings)
    # else:
    #     print("Failed to extract URL or headings from the Markdown file.")