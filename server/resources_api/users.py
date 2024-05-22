from flask_restful import Resource, marshal_with, reqparse, abort
from resources_api.resource_fields_definitions import (
    user_resource_fields,
    user_with_university_resource_fields,
)
from sqlalchemy import text, exc
from database.database_setup import db
from database.models import UserTable
import uuid
from flask import request
import hashlib
import secrets


class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id):
        return db.get_or_404(
            UserTable, user_id, description=f"No user with the ID '{user_id}'."
        )


user_put_args = reqparse.RequestParser()
user_put_args.add_argument(
    "user_id", type=str, location="args", help="User ID to create user"
)
user_put_args.add_argument(
    "username", type=str, location="args", help="User name to create user"
)
user_put_args.add_argument(
    "pwd", type=str, location="args", help="Password to create user"
)
user_put_args.add_argument(
    "nationality", type=str, location="args", help="Nationality of user"
)
user_put_args.add_argument(
    "home_university", type=str, location="args", help="Home university of user"
)

user_update_args = reqparse.RequestParser()
user_update_args.add_argument(
    "user_id", type=str, location="args", help="User ID to update user"
)
user_update_args.add_argument(
    "username", type=str, location="args", help="User name to update user"
)
user_update_args.add_argument(
    "pwd", type=str, location="args", help="Password to update user"
)
user_update_args.add_argument(
    "nationality", type=str, location="args", help="Nationality of user"
)
user_update_args.add_argument(
    "home_university", type=str, location="args", help="Home university of user"
)

user_delete_args = reqparse.RequestParser()
user_delete_args.add_argument(
    "user_id", type=str, location="args", help="User ID to delete user"
)


# Function to generate a salt
def generate_salt():
    return secrets.token_hex(16)

# Function to hash a password
def hash_password(password, salt):
    # Concatenate password and salt
    salted_password = password + salt
    # Hash the salted password using SHA-256
    hashed_password = hashlib.sha256(salted_password.encode()).hexdigest()
    return hashed_password

class UsersAllRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = UserTable.query.order_by(UserTable.username).all()
        return [user for user in users], 200

    @marshal_with(user_resource_fields)
    def put(self):
        try:
            args = user_put_args.parse_args()
            # Create a new UserTable object and assign values from args
            uid = str(uuid.uuid4())

            # Generate a salt
            salt = generate_salt()
            # Hash the password
            hashed_password = hash_password(args['pwd'], salt)

            new_user = UserTable(
                user_id = uid,
                # user_id=args['user_id'],
                username=args['username'],
                # pwd=args['pwd'],
                pwd=hashed_password,  # Save the hashed password
                salt=salt,  # Save the salt
                nationality=args['nationality'],
                home_university=args['home_university']
            )  

            db.session.add(new_user)
            db.session.commit()
            print(new_user)
            return new_user, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(user_resource_fields, 200)
    def patch(self):
        try:
            args = user_update_args.parse_args()
            # user_id should be generated automatically
            user_id = args['user_id']
            user = db.session.query(UserTable).filter_by(user_id=user_id).first()
            # Update the user attributes if they are present in the args
            if 'username' in args and args['username'] != None:
                user.username = args['username']
            if 'pwd' in args and args['pwd'] != None:
                salt = generate_salt()
                # Hash the new password with the generated salt
                hashed_password = hash_password(args['pwd'], salt)
                # Update the hashed password and salt columns
                user.pwd = hashed_password
                user.salt = salt
            if 'nationality' in args and args['nationality'] != None:
                user.nationality = args['nationality']
            if 'home_university' in args and args['home_university'] != None:
                user.home_university = args['home_university']
            db.session.commit()
            return user, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = user_delete_args.parse_args()
#             user_id = args['user_id']
#             # print(f"Attempting to delete user with username: {username}")
#             user = db.session.query(UserTable).filter_by(user_id=user_id).first()
#             if not user:
#                 print(f"No user found with the user id: {user_id}")
#                 return {"message": f"No user with the user id '{user_id}'"}, 404
            user_id = args["user_id"]
            user = db.get_or_404(
                UserTable, user_id, description=f"No user with the ID '{user_id}'."
            )
            db.session.delete(user)
            db.session.commit()
            print(f"User with user_id '{user_id}' deleted successfully")
            return {"message": f"User with user_id '{user_id}' deleted successfully"}, 200
        except Exception as e:
            print(f"An error occurred: {e}")
            abort(message=str(e), http_status_code=500)

class UserWithUniversityRes(Resource):
    @marshal_with(user_with_university_resource_fields)
    def get(self, user_id):
        # TODO: rewrite this
        sql_raw = "SELECT * FROM user_table JOIN university_table ON user_table.home_university = university_table.university_id WHERE user_table.user_id = :val"
        res = db.session.execute(text(sql_raw), {"val": user_id}).first()
        print(res)
        return res

class UserLoginRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        try:
            args = user_put_args.parse_args()
            username = args['username']
            password = args['pwd']

            # Retrieve user from the database based on the provided username
            user = UserTable.query.filter_by(username=username).first()

            if user:
                # Hash the provided password using the salt stored in the database
                hashed_password = hash_password(password, user.salt)

                # Check if the hashed password matches the stored hashed password
                if hashed_password == user.pwd:
                    # Passwords match, user is authenticated, return user information
                    return user, 200
                else:
                    # Passwords do not match, user authentication failed
                    abort(message="Invalid credentials", http_status_code=401)
            else:
                # User with the provided username not found
                abort(message="User not found", http_status_code=404)
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)