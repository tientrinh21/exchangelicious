from flask import Flask, jsonify
from flask_restful import Api, Resource, fields, marshal_with, reqparse, abort
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

# Validation and error handling of the put request
user_put_args = reqparse.RequestParser()
user_put_args.add_argument("username", type=str, help="the username of the user is required. Must be unique", required = True)
user_put_args.add_argument("password", type=str, help="Password of the user is required", required=True )

user_update_args = reqparse.RequestParser() # the arguments are optional
user_update_args.add_argument("username", type=str, help="the username of the user is required. Must be unique")
user_update_args.add_argument("password", type=str, help="Password of the user is required")

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
    
# remove this trash
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

# How to query with SQLAlchemy
# https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/queries/

class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id):
        # result = User.query.get(username)
        result = db.get_or_404(User, user_id)
        # if not result:
        #     abort(404, message="could not find the user")
        return result
    
    # this needs to be tested and expanded upon
    @marshal_with(user_resource_fields) # serialization
    def put(self, user_id):
        args = user_put_args.parse_args()
        # Does the user already exists?
        # result = User.query.get(args['username'])
        # if result:
        #     abort(409, message="User already exists")

        user = User(username=args['username'], password=args['password'])
        db.session.add(user) # temporary add
        db.session.commit(user) # actually add
        return user, 201 # 201 is means created
    
    @marshal_with(user_resource_fields)
    def patch(self, user_id):
        args = user_update_args.parse_args()
        result = db.get_or_404(User, user_id)

        # result = User.query.filter_by(id=user_id).first()
        # if not result:
        #     abort(404, message="User doesn't exist, cannot update")
        
        if "username" in args:
            result.username = args["username"]
        if "password" in args:
            result.password = args["password"]
        
        db.session.commit() # commit the changes

        return result

    def delete(self, user_id):
        result = User.query.filter_by(id=user_id).first()
        if not result:
            abort(404, message="User doesn't exist, cannot delete")
        db.session.delete(result)
        db.session.commit()

class UsersAllRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = User.query.order_by(User.username).all()
        return [user for user in users], 200

class UniversityRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self, university_id):
        return University.query.get(id=university_id), 200

class UniversityAllRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self):
        unis = University.query.order_by(University.long_name).all()
        return [uni for uni in unis], 200


class HelloWorld(Resource):
    def get(self, name):
        return {"name": name}
    
    def post(self):
        return {"data:" "Posted"}
    
# register the resource at a certain route
api.add_resource(HelloWorld, "/api/helloworld/<string:name>")
api.add_resource(UserRes, '/api/users/<string:user_id>')
api.add_resource(UsersAllRes, '/api/users')
api.add_resource(UniversityRes, '/api/university/<string:university_id>')
api.add_resource(UniversityAllRes, '/api/university')
# beware. The address should not end with a slash

if __name__ == "__main__":
    app.run(debug=True, port=8080)
