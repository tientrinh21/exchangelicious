from flask import Flask, jsonify
from flask_restful import Api, Resource, fields, marshal_with
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from sqlalchemy import URL, create_engine

# loads the variables in the .env file so we can access them
load_dotenv()
# app instance
app = Flask(__name__)
CORS(app)
# we are gonna build a api
api = Api(app)

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

app.config['SQLALCHEMY_DATABASE_URI'] = url_object
db = SQLAlchemy(app)

# inspo: https://www.youtube.com/watch?v=GMppyAPbLYk

# handle serialization
user_resource_fields = {
    'username': fields.String,
    'password': fields.String
}

university_resource_fields = {
    'university_id': fields.String,
    'long_name': fields.String,
    'info_page_id': fields.String,
}


# Here we are just reflecting the database
# Should maybe be changed at a later date,
# when the database schema is mostly decided on
db.Model.metadata.reflect(bind=create_engine(url_object),schema=DB_NAME)

class User(db.Model):
    '''deal with an existing table'''
    __table__ = db.Model.metadata.tables[f'{DB_NAME}.user']

class University(db.Model):
    '''deal with an existing table'''
    __table__ = db.Model.metadata.tables[f'{DB_NAME}.university']

# The above code should be changed to this 
# Basically is the schema in a data base
# class User(db.Model):
#     user_id = db.Column(db.String(40), primary_key=True)
#     username = db.Column(db.String, unique=True)
#     # TODO: Handle password security
#     password = db.Column(db.String, nullable=False)
#     home_university = db.Column(db.String)

#     # to string
#     def __repr__(self):
#         return f'<User {self.username}>'
    

# class UserStuff: 
#     def __init__(self, username, password) -> None:
#         self.username = username
#         self.password = password
    
#     # deserialization
#     @staticmethod
#     def from_dict(data):
#         return UserStuff(data.get('id'), data.get('username'), data.get('email'))

#     # serialization
#     def to_dict(self):
#         return {"id": self.id, 'username': self.username, 'email': self.email}

class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, username):
        user = User.query.get(username)
        return user
    
    # this needs to be tested and expanded upon
    @marshal_with(user_resource_fields)
    def put(self, username, password):
        user = User(username, password)
        db.session.add(user) # temporary add
        db.session.commit(user) # actually add
        return user, 201

class UsersAllRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = User.query.order_by(User.username).all()
        return [user for user in users], 201

class UniversityRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self, university_id):
        return University.query.get(id=university_id), 201

class UniversityAllRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self):
        unis = University.query.order_by(University.long_name).all()
        return [uni for uni in unis], 201


class HelloWorld(Resource):
    def get(self, name):
        return {"name": name}
    
    def post(self):
        return {"data:" "Posted"}
    
# register the resource at a certain route
api.add_resource(HelloWorld, "/api/helloworld/<string:name>")
api.add_resource(UserRes, '/api/users/<string:username>')
api.add_resource(UsersAllRes, '/api/users')
api.add_resource(UniversityRes, '/api/university/<string:university_id>')
api.add_resource(UniversityAllRes, '/api/university')

if __name__ == "__main__":
    app.run(debug=True)
