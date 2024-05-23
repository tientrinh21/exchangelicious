from database.database_setup import db
from database.models import CountryTable, InfoPageTable, UniversityTable
from flask_restful import Resource, abort, marshal_with, reqparse
from sqlalchemy import select

from resources_api.resource_fields_definitions import (
    search_universities_resource_fields, university_meta_table_resource_fields,
    university_resource_fields, university_with_info_resource_fields)


class UniversityRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self, university_id):
        stmt = (
            select(UniversityTable, CountryTable)
            .join(CountryTable, UniversityTable.country_code == CountryTable.country_code)
            .where(UniversityTable.university_id == university_id)
        )
        res = db.session.execute(stmt).first()
        if res is None:
            abort(
                message=f"No university with the ID '{university_id}'.",
                http_status_code=404,
            )

        parent, child = res
        result = parent.__dict__
        result.update(child.__dict__)
        return result, 200


class UniversityWithInfoRes(Resource):
    @marshal_with(university_with_info_resource_fields)
    def get(self, university_id):
        return db.get_or_404(
            InfoPageTable,
            f"{university_id}_page",
            description=f"No university with the ID '{university_id}'.",
        )



class UniversityAllRes(Resource):
    @marshal_with(university_meta_table_resource_fields)
    def get(self):
        unis = UniversityTable.query.order_by(UniversityTable.long_name).all()
        return [uni for uni in unis], 200

class UniversityPagination(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            "page_number", type=int, default=1, location="args", required=True
        )
        self.reqparse.add_argument(
            "search_word", type=str, default="", location="args", required=True
        )

    # pagination: https://www.youtube.com/watch?v=hkL9pgCJPNk
    @marshal_with(search_universities_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        page_number = args["page_number"]
        search_word = args["search_word"]

        # TODO: Change per_page=3 to a higher number when we have more entries in our database
        # In both res = db.paginate.... queries
        if search_word == "":
            res = db.paginate(select(UniversityTable), per_page=5, page=page_number)
        else:
            res = db.paginate(select(UniversityTable).where(UniversityTable.long_name.contains(search_word)), per_page=5, page=page_number)
        return {"hasMore": res.has_next, "items": [r for r in res]}, 200
