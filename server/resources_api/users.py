from flask_restful import Resource, marshal_with
from resources_api.resource_fields_definitions import user_resource_fields, user_with_university_resource_fields
from sqlalchemy import text
from database.database_setup import db
from database.models import UserTable

class UserRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id):
        return db.get_or_404(UserTable, user_id, description=f"No user with the ID '{user_id}'.")

class UsersAllRes(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = UserTable.query.order_by(UserTable.username).all()
        return [user for user in users], 200

class UserWithUniversityRed(Resource):
    @marshal_with(user_with_university_resource_fields)
    def get(self, user_id):
        sql_raw = "SELECT * FROM user_table JOIN university_table ON user_table.home_university = university_table.university_id WHERE user_table.user_id = :val"
        res = db.session.execute(text(sql_raw), {"val": user_id}).first()
        print(res)
        return res