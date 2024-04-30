import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
from dotenv import load_dotenv


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

db = SQLAlchemy()