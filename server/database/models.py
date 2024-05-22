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


class PartnerUniversitiesTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.partner_universities_table"]


class UserTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.user_table"]

    def __repr__(self):
        return f"<User {self.username}>"


class ExchangeUniversityTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.exchange_university_table"]

class ReviewTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.review_table"]
    
    def __repr__(self):
        return f"<Review ({self.review_id}, {self.title}, {self.content}, {self.submit_datetime},)>"


class ReplyTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.reply_table"]


# class CountryTable(db.Model):
#     __tablename__ = 'country_table'
#     country_code = db.Column(db.String(3), primary_key=True)
#     country_name = db.Column(db.String(200), nullable=False)
#     code = db.Column(db.String(2))

# class InfoPageTable(db.Model):
#     __tablename__ = 'info_page_table'
    
#     info_page_id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     webpage = db.Column(db.Text)
#     introduction = db.Column(db.Text)
#     location = db.Column(db.Text)
#     semester = db.Column(db.Text)
#     application_deadline = db.Column(db.Text)
#     courses = db.Column(db.Text)
#     housing = db.Column(db.Text)
#     tuition = db.Column(db.Text)
#     visa = db.Column(db.Text)
#     eligibility = db.Column(db.Text)
#     requirements = db.Column(db.Text)

# class UniversityTable(db.Model):
#     __tablename__ = 'university_table'
    
#     university_id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     country_code = db.Column(db.String(3), db.ForeignKey('country_table.country_code', ondelete='SET NULL', onupdate='CASCADE'))
#     region = db.Column(db.String(40))
#     long_name = db.Column(db.String(255))
#     info_page_id = db.Column(db.String(36), db.ForeignKey('info_page_table.info_page_id', ondelete='SET NULL', onupdate='CASCADE'))
#     ranking = db.Column(db.String(10))


# class PartnerUniversitiesTable(db.Model):
#     __tablename__ = 'partner_universities_table'
    
#     id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     from_university_id = db.Column(db.String(36), db.ForeignKey('university_table.university_id', ondelete='CASCADE', onupdate='CASCADE'))
#     to_university_id = db.Column(db.String(36), db.ForeignKey('university_table.university_id', ondelete='CASCADE', onupdate='CASCADE'))


# class UserTable(db.Model):
#     __tablename__ = 'user_table'
    
#     user_id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     username = db.Column(db.String(40), unique=True)
#     pwd = db.Column(db.String(30))
#     nationality = db.Column(db.String(3), db.ForeignKey('country_table.country_code', ondelete='SET NULL', onupdate='CASCADE'))
#     home_university = db.Column(db.String(40), db.ForeignKey('university_table.university_id', ondelete='SET NULL', onupdate='CASCADE'))


# class ExchangeUniversityTable(db.Model):
#     __tablename__ = 'exchange_university_table'
    
#     id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     user_id = db.Column(db.String(36), db.ForeignKey('user_table.user_id', ondelete='CASCADE', onupdate='CASCADE'))
#     university_id = db.Column(db.String(36), db.ForeignKey('university_table.university_id', ondelete='CASCADE', onupdate='CASCADE'))


# class ReviewTable(db.Model):
#     __tablename__ = 'review_table'
    
#     review_id = db.Column(db.String(36), primary_key=True, default=func.uuid())
#     university_id = db.Column(db.String(36), nullable=False)
#     user_id = db.Column(db.String(36), nullable=False)
#     title = db.Column(db.String(100), nullable=False)
#     content = db.Column(db.Text)
#     submit_datetime = db.Column(db.DateTime)
#     last_edit_datetime = db.Column(db.DateTime)
#     mood_score = db.Column(ENUM('very bad', 'bad', 'neutral', 'good', 'very good'))
#     up_vote = db.Column(db.Integer)
#     down_vote = db.Column(db.Integer)


# class ReplyTable(db.Model):
#     __tablename__ = 'reply_table'
    
#     reply_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     user_id = db.Column(db.String(36), nullable=False)
#     content = db.Column(db.Text)
#     parent_review_id = db.Column(db.Integer)


# # Marshmallow schema stuff - new way to handle serialization
# class CountrySchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = CountryTable
#         load_instance = True

# class InfoPageSchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = InfoPageTable
#         load_instance = True

# class UniversitySchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = UniversityTable
#         load_instance = True

# class PartnerUniversitiesSchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = PartnerUniversitiesTable
#         load_instance = True

# class UserSchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = UserTable
#         load_instance = True

# class ExchangeUniversitySchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = ExchangeUniversityTable
#         load_instance = True

# class ReviewSchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = ReviewTable
#         load_instance = True

# class ReplySchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = ReplyTable
#         load_instance = True

# country_schema = CountrySchema()
# countries_schema = CountrySchema(many=True)

# info_page_schema = InfoPageSchema()
# info_pages_schema = InfoPageSchema(many=True)

# university_schema = UniversitySchema()
# universities_schema = UniversitySchema(many=True)

# partner_universities_schema = PartnerUniversitiesSchema()
# partners_universities_schema = PartnerUniversitiesSchema(many=True)

# user_schema = UserSchema()
# users_schema = UserSchema(many=True)

# exchange_university_schema = ExchangeUniversitySchema()
# exchanges_university_schema = ExchangeUniversitySchema(many=True)

# review_schema = ReviewSchema()
# reviews_schema = ReviewSchema(many=True)

# The above code should be changed to this
# Basically is the schema in a data base
# class User(db.Model):
#     __tablename__ = f"{DB_NAME}.user_table"
#     user_id = db.Column(db.String(40), primary_key=True)
#     username = db.Column(db.String, unique=True)
#     # TODO: Handle password security
#     password = db.Column(db.String, nullable=False)
#     home_university = db.Column(db.String)

#     # to string
#     def __repr__(self):
#         return f'<User {self.username}>'
