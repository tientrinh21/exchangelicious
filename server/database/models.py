import os
from dotenv import load_dotenv
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy import create_engine
from database.database_setup import db, get_database_uri
from dataclasses import dataclass
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import ENUM
from sqlalchemy.sql import func

# loads the variables in the .env file so we can access them
load_dotenv()

DB_NAME = os.getenv("DB_NAME")


# inspo: https://www.youtube.com/watch?v=GMppyAPbLYk
# # Here we are just reflecting the database
# # Should maybe be changed at a later date,
# # when the database schema is mostly decided on
db.Model.metadata.reflect(bind=create_engine(get_database_uri()), schema=DB_NAME)

class CountryTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.country_table"]


class InfoPageTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.info_page_table"]


class UniversityTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.university_table"]

    def __repr__(self):
        return f"<University {self.university_id} + {self.long_name}>"

class UserTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.user_table"]

    def __repr__(self):
        return f"<User {self.username}>"

class ReviewTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.review_table"]
    
    def __repr__(self):
        return f"<Review ({self.review_id}, {self.title}, {self.content}, {self.submit_datetime},)>"

class UpvoteTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.upvote_table"]


class DownvoteTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.downvote_table"]

