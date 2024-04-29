from flask_restful import Resource, marshal_with
from resources_api.resource_fields_definitions import university_resource_fields, university_with_info_resource_fields
from sqlalchemy import text
from database.database_setup import db
from database.models import UniversityTable

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

class UniversityAllRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self):
        unis = UniversityTable.query.order_by(UniversityTable.long_name).all()
        return [uni for uni in unis], 200