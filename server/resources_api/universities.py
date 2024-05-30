from database.database_setup import db
from database.models import CountryTable, InfoPageTable, UniversityTable
from flask_restful import Resource, abort, marshal_with, reqparse
from sqlalchemy import select, exc

import uuid

from resources_api.resource_fields_definitions import (
    search_universities_resource_fields, university_meta_table_resource_fields,
    university_resource_fields, university_with_info_resource_fields)

uni_put_args = reqparse.RequestParser()
uni_put_args.add_argument(
    "university_id", type=str, location="args", help="University ID to create university"
)
uni_put_args.add_argument(
    "country_code", type=str, location="args", help="Uni country code"
)
uni_put_args.add_argument(
    "region", type=str, location="args", help="Uni region"
)
uni_put_args.add_argument(
    "long_name", type=str, location="args", help="Full name of university"
)
uni_put_args.add_argument(
    "ranking", type=str, location="args", help="Ranking of a university"
)
uni_put_args.add_argument(
    "info_page_id", type=str, location="args", help="Information of a university"
)
uni_put_args.add_argument(
    "campus", type=str, location="args", help="Campus of a university"
)
uni_put_args.add_argument(
    "housing", type=str, location="args", help="Housing availability of a university"
)

uni_update_args = reqparse.RequestParser()
uni_update_args.add_argument(
    "university_id", type=str, location="args", help="University ID to create university"
)
uni_update_args.add_argument(
    "country_code", type=str, location="args", help="Uni country code"
)
uni_update_args.add_argument(
    "region", type=str, location="args", help="Uni region"
)
uni_update_args.add_argument(
    "long_name", type=str, location="args", help="Full name of university"
)
uni_update_args.add_argument(
    "ranking", type=str, location="args", help="Ranking of a university"
)
uni_update_args.add_argument(
    "info_page_id", type=str, location="args", help="Information of a university"
)
uni_update_args.add_argument(
    "campus", type=str, location="args", help="Campus of a university"
)
uni_update_args.add_argument(
    "housing", type=str, location="args", help="Housing availability of a university"
)

uni_delete_args = reqparse.RequestParser()
uni_delete_args.add_argument(
    "university_id", type=str, location="args", help="Uni ID to delete university"
)

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
    
    @marshal_with(university_meta_table_resource_fields)
    def post(self, university_id):
        try:
            args = uni_put_args.parse_args()
            uniid = str(uuid.uuid4())
            # university_id=args["university_id"]

            new_uni = UniversityTable(
                # university_id=university_id,
                university_id=uniid,
                country_code=args["country_code"],
                region=args["region"],
                long_name=args["long_name"],
                ranking=args["ranking"],
                info_page_id=args["info_page_id"],
                campus=args["campus"],
                housing=args["housing"],
            )
            db.session.add(new_uni)
            db.session.commit()
            return new_uni, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(university_meta_table_resource_fields)
    def patch(self):
        try:
            args = uni_update_args.parse_args()
            uniid = args["university_id"]
            uni = db.session.query(UniversityTable).filter_by(university_id=uniid).first()
            # if 'university_id' in args and args['university_id'] != None:
            #     uni.university_id = args['university_id']
            if 'country_code' in args and args['country_code'] != None:
                uni.country_code = args["country_code"]
            if 'region' in args and args['region'] != None:
                uni.region = args["region"]
            if 'long_name' in args and args['long_name'] != None:
                uni.long_name = args["long_name"]
            if 'ranking' in args and args['ranking'] != None:
                uni.ranking = args["ranking"]
            if 'info_page_id' in args and args["info_page_id"] != None:
                uni.info_page_id = args["info_page_id"]
            if 'campus' in args and args["campus"] != None:
                uni.campus = args["campus"]
            if 'housing' in args and args["housing"] != None:
                uni.housing = args["housing"]
            db.session.commit()
            return uni, 200

        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

class UniversityAllRes(Resource):
    @marshal_with(university_meta_table_resource_fields)
    def get(self):
        unis = UniversityTable.query.order_by(UniversityTable.long_name).all()
        return [uni for uni in unis], 200
    
    @marshal_with(university_meta_table_resource_fields)
    def post(self):
        try:
            args = uni_put_args.parse_args()
            uniid = str(uuid.uuid4())

            new_uni = UniversityTable(
                university_id=uniid,
                country_code=args["country_code"],
                region=args["region"],
                long_name=args["long_name"],
                ranking=args["ranking"],
                info_page_id=args["info_page_id"],
                campus=args["campus"],
                housing=args["housing"],
            )
            db.session.add(new_uni)
            db.session.commit()
            return new_uni, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(university_meta_table_resource_fields)
    def patch(self):
        try:
            args = uni_update_args.parse_args()
            uniid = args['university_id']
            uni = db.session.query(UniversityTable).filter_by(university_id=uniid).first()
            # if 'university_id' in args and args['university_id'] != None:
            #     uni.university_id = args['university_id']
            if 'country_code' in args and args['country_code'] != None:
                uni.country_code = args["country_code"]
            if 'region' in args and args['region'] != None:
                uni.region = args["region"]
            if 'long_name' in args and args['long_name'] != None:
                uni.long_name = args["long_name"]
            if 'ranking' in args and args['ranking'] != None:
                uni.ranking = args["ranking"]
            if 'info_page_id' in args and args["info_page_id"] != None:
                uni.info_page_id = args["info_page_id"]
            if 'campus' in args and args["campus"] != None:
                uni.campus = args["campus"]
            if 'housing' in args and args["housing"] != None:
                uni.housing = args["housing"]
            db.session.commit()
            return uni, 200

        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(university_meta_table_resource_fields)
    def delete(self):
        try:
            args = uni_delete_args.parse_args()
            uniid = args["university_id"]
            uni = db.get_or_404(
                UniversityTable, uniid, description=f"No Univerisity with the ID '{uniid}'."
            )
            db.session.delete(uni)
            db.session.commit()
            print(f"University with uni_id '{uniid}' deleted successfully")
            return {"message": f"University with uni_id '{uniid}' deleted successfully"}, 200
        except Exception as e:
            print(f"An error occurred: {e}")
            abort(message=str(e), http_status_code=500)

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
