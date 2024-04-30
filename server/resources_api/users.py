from flask_restful import Resource, marshal_with, reqparse, abort
from resources_api.resource_fields_definitions import user_resource_fields, user_with_university_resource_fields
from sqlalchemy import text, exc
from database.database_setup import db
from database.models import UserTable
import requests

class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id):
        return db.get_or_404(UserTable, user_id, description=f"No user with the ID '{user_id}'.")
    
user_put_args = reqparse.RequestParser()
user_put_args.add_argument('user_id', type=str, location = "args", help='User ID to create user')
user_put_args.add_argument('username', type=str, location = "args", help='User name to create user')
user_put_args.add_argument('pwd', type=str, location = "args", help='Password to create user')
user_put_args.add_argument('nationality', type=str, location = "args", help='Nationality of user')
user_put_args.add_argument('home_university', type=str, location = "args", help='Home university of user')

user_update_args = reqparse.RequestParser()
user_update_args.add_argument('user_id', type=str, location = "args", help='User ID to update user')
user_update_args.add_argument('username', type=str, location = "args", help='User name to update user')
user_update_args.add_argument('pwd', type=str, location = "args", help='Password to update user')
user_update_args.add_argument('nationality', type=str, location = "args", help='Nationality of user')
user_update_args.add_argument('home_university', type=str, location = "args", help='Home university of user')

user_delete_args = reqparse.RequestParser()
user_delete_args.add_argument('user_id', type=str, location = "args", help='User ID to delete user')

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
            new_user = UserTable(
                user_id=args['user_id'],
                username=args['username'],
                pwd=args['pwd'],
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
            user_id = args['user_id']
            # user = UserTable.query.get(user_id)
            user = db.get_or_404(UserTable, user_id, description=f"No user with the ID '{user_id}'.")
            # Update the user attributes if they are present in the args
            if 'username' in args:
                user.username = args['username']
            if 'pwd' in args:
                user.pwd = args['pwd']
            if 'nationality' in args:
                user.nationality = args['nationality']
            if 'home_university' in args:
                user.home_university = args['home_university']
            db.session.commit()
            return user, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)
        
    def delete(self):
        try:
            args = user_delete_args.parse_args()
            user_id = args['user_id']
            user = db.get_or_404(UserTable, user_id, description=f"No user with the ID '{user_id}'.")
            db.session.delete(user)
            db.session.commit()
            return {"message": f"User with ID '{user_id}' deleted successfully"}, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

class UserWithUniversityRed(Resource):
    @marshal_with(user_with_university_resource_fields)
    def get(self, user_id):
        sql_raw = "SELECT * FROM user_table JOIN university_table ON user_table.home_university = university_table.university_id WHERE user_table.user_id = :val"
        res = db.session.execute(text(sql_raw), {"val": user_id}).first()
        print(res)
        return res