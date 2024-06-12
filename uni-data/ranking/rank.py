import pandas as pd
import os
from sqlalchemy import create_engine, text, Table, MetaData, URL, insert, Column
from sqlalchemy.dialects.mysql import VARCHAR
from dotenv import load_dotenv
from sqlalchemy.dialects.mysql import insert

# loads the variables in the .env file so we can access them
load_dotenv()

def get_database_uri(): 
    uri = URL.create(
        "mysql+mysqlconnector",
        username=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),  # plain (unescaped) text
        host=os.getenv("DB_SERVER"),
        port= os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
    )
    return uri

# Create an SQLAlchemy engine
engine = create_engine(get_database_uri())

# Define the SQL create table statement
sql_create = """CREATE TABLE IF NOT EXISTS uni_ranking_table (
    uni_name VARCHAR(200) NOT NULL PRIMARY KEY,
    uni_rank VARCHAR(10) NOT NULL,
    uni_url VARCHAR(200)
);"""

sql_drop = """drop table if exists uni_ranking_table;"""

# Execute the SQL statement
with engine.connect() as connection:
    try:
        connection.execute(text(sql_drop))
        connection.execute(text(sql_create))
        print("Table created successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

ranking_data = pd.read_csv('./uni-data/ranking/ranking.csv', usecols=[0, 1, 16], header=0)
# print(ranking_data)
rank_data = []

for index, row in ranking_data.iterrows():
    rank = row[0]
    uni_name = row[1]
    url = row[2]

    if rank == "Reporter" or rank == "1501":
        rank = "1500+"

    uni_info = {
        'uni_name': uni_name,
        'uni_rank': rank,
        'uni_url': url
    }

    rank_data.append(uni_info)

# Insert data into the table
metadata = MetaData()
uni_ranking_table = Table('uni_ranking_table', metadata,
    Column('uni_name', VARCHAR(200), primary_key=True),
    Column('uni_rank', VARCHAR(10), nullable=False),
    Column('uni_url', VARCHAR(100))
)


with engine.begin() as connection:
    try:
        for dt in rank_data:
            connection.execute(insert(uni_ranking_table), dt)
        print("Data inserted successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")