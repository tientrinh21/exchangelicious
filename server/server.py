from flask import Flask
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from sqlalchemy import URL, create_engine, select, text
from flask_swagger_ui import get_swaggerui_blueprint

# loads the variables in the .env file so we can access them
load_dotenv()
# app instance
app = Flask(__name__)

# we are gonna build a api
api = Api(app)
# cors = CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# Swagger setup - https://pypi.org/project/flask-swagger-ui/
# https://www.youtube.com/watch?v=AyyX9yM_OZk
SWAGGER_URL = ''  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/api_swagger_docs.json' # Our API url (can of course be a local resource)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "EduVenture Api Docs"
    }
)
app.register_blueprint(swaggerui_blueprint)


# DB setup
DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_SERVER = os.getenv("DB_SERVER")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

url_object = URL.create(
    "mysql+mysqlconnector",
    username=DB_USERNAME,
    password=DB_PASSWORD,  # plain (unescaped) text
    host=DB_SERVER,
    port=DB_PORT,
    database=DB_NAME,
)

app.config["SQLALCHEMY_DATABASE_URI"] = url_object
db = SQLAlchemy(app)


# inspo: https://www.youtube.com/watch?v=GMppyAPbLYk

# Here we are just reflecting the database
# Should maybe be changed at a later date,
# when the database schema is mostly decided on
db.Model.metadata.reflect(bind=create_engine(url_object), schema=DB_NAME)


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
        return f'<University {self.university_id} + {self.long_name}>'


class PartnerUniversitiesTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.partner_universities_table"]


class UserTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.user_table"]

    def __repr__(self):
        return f'<User {self.username}>'


class ExchangeUniversityTable(db.Model):
    """deal with an existing table"""

    __table__ = db.Model.metadata.tables[f"{DB_NAME}.exchange_university_table"]


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

# handle serialization
info_page_resource_fields = {
    "info_page_id": fields.String,
    "intro_text": fields.String,
    "intro_source": fields.String,
}

university_resource_fields = {
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
}

university_with_info_resource_fields = {
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
    "info_page_id": fields.String,
    "intro_text": fields.String,
    "intro_source": fields.String,
}

user_resource_fields = {
    "user_id": fields.String,
    "username": fields.String,
    "pwd": fields.String,
    "nationality": fields.String,
    "home_university": fields.String,
}

user_with_university_resource_fields = {
    "user_id": fields.String,
    "username": fields.String,
    "pwd": fields.String,
    "nationality": fields.String,
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
}

search_universities_resource_fields = {
    "hasMore": fields.Boolean,
    "items":  fields.List(fields.Nested(university_resource_fields))
    }


# How to query with SQLAlchemy
# https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/queries/

class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id):
        return db.get_or_404(UserTable, user_id, description=f"No user with the ID '{user_id}'.")

class UsersAllRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = UserTable.query.order_by(UserTable.username).all()
        return [user for user in users], 200

class UniversityRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self, university_id):
        return db.get_or_404(UniversityTable, university_id,  description=f"No university with the ID '{university_id}'.")
    
class UniversityWithInfoRes(Resource):
    @marshal_with(university_with_info_resource_fields)
    def get(self, university_id):
        sql_raw = "SELECT * FROM university_table JOIN info_page_table ON university_table.info_page_id = info_page_table.info_page_id WHERE university_table.university_id = :val"
        res = db.session.execute(text(sql_raw), {"val": university_id}).first()
        print(res)
        return res

class UserWithUniversityRed(Resource):
    @marshal_with(user_with_university_resource_fields)
    def get(self, user_id):
        sql_raw = "SELECT * FROM user_table JOIN university_table ON user_table.home_university = university_table.university_id WHERE user_table.user_id = :val"
        res = db.session.execute(text(sql_raw), {"val": user_id}).first()
        print(res)
        return res

class UniversityAllRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self):
        unis = UniversityTable.query.order_by(UniversityTable.long_name).all()
        return [uni for uni in unis], 200
    
class UniversityPagination(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('page_number', type = int, default=1, location = "args")
        self.reqparse.add_argument('search_word', type = str, default='nor', location = "args")

    # pagination: https://www.youtube.com/watch?v=hkL9pgCJPNk
    @marshal_with(search_universities_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        page_number = args["page_number"]
        search_word = args["search_word"]

        if search_word == "":
            res = db.paginate(select(UniversityTable), per_page=2, page=page_number)
        else:
            res = db.paginate(select(UniversityTable).where(UniversityTable.long_name.contains(search_word)), per_page=2, page=page_number)
        return {"hasMore": res.has_next, "items": [r for r in res]}, 200



# register the resource at a certain route
api.add_resource(UserRes, "/api/users/<string:user_id>")
api.add_resource(UsersAllRes, "/api/users")
api.add_resource(UniversityRes, "/api/universities/<string:university_id>")
api.add_resource(UniversityWithInfoRes, "/api/universities/<string:university_id>/info")
api.add_resource(UniversityAllRes, "/api/universities")
api.add_resource(UserWithUniversityRed, "/api/users/<string:user_id>/uni")
api.add_resource(UniversityPagination, "/api/universities/search")
# beware. The address should not end with a slash

if __name__ == "__main__":
    app.run(debug=True, port=8080)
