from uuid import uuid4

from database.database_setup import db
from database.models import CountryTable, InfoPageTable, UniversityTable
from flask_restful import Resource, abort, marshal_with, reqparse
from resources_api.resource_fields_definitions import (
    search_universities_resource_fields,
    university_meta_table_resource_fields,
    university_resource_fields,
    university_with_info_resource_fields,
)
from sqlalchemy import exc, select

uni_put_args = reqparse.RequestParser()
uni_put_args.add_argument(
    "university_id",
    type=str,
    location="args",
    help="University ID to create university",
)
uni_put_args.add_argument(
    "country_code", type=str, location="args", help="Uni country code"
)
uni_put_args.add_argument("region", type=str, location="args", help="Uni region")
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
    "university_id",
    type=str,
    location="args",
    help="University ID to create university",
)
uni_update_args.add_argument(
    "country_code", type=str, location="args", help="Uni country code"
)
uni_update_args.add_argument("region", type=str, location="args", help="Uni region")
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

info_get_args = reqparse.RequestParser()
info_get_args.add_argument("university_id", type=str, location="args", required=True)

info_post_args = reqparse.RequestParser()
info_post_args.add_argument("university_id", type=str, location="args", required=True)
info_post_args.add_argument(
    "webpage", type=str, location="args", help="Webpage to create info"
)
info_post_args.add_argument(
    "introduction", type=str, location="args", help="Introduction to create info"
)
info_post_args.add_argument(
    "location", type=str, location="args", help="location to create info"
)
info_post_args.add_argument(
    "semester", type=str, location="args", help="semester to create info"
)
info_post_args.add_argument(
    "application_deadline",
    type=str,
    location="args",
    help="Application deadline to create info",
)
info_post_args.add_argument(
    "courses", type=str, location="args", help="courses to create info"
)
info_post_args.add_argument(
    "housing", type=str, location="args", help="housing to create info"
)
info_post_args.add_argument(
    "tuition", type=str, location="args", help="tuition to create info"
)
info_post_args.add_argument(
    "visa", type=str, location="args", help="visa to create info"
)
info_post_args.add_argument(
    "eligibility", type=str, location="args", help="eligibility to create info"
)
info_post_args.add_argument(
    "requirements", type=str, location="args", help="requirements to create info"
)

info_patch_args = reqparse.RequestParser()
info_patch_args.add_argument(
    "info_page_id",
    type=str,
    location="args",
    required=True,
    help="Info page ID to update info",
)
info_patch_args.add_argument(
    "webpage", type=str, location="args", help="Webpage to create info"
)
info_patch_args.add_argument(
    "introduction", type=str, location="args", help="Introduction to create info"
)
info_patch_args.add_argument(
    "location", type=str, location="args", help="location to create info"
)
info_patch_args.add_argument(
    "semester", type=str, location="args", help="semester to create info"
)
info_patch_args.add_argument(
    "application_deadline",
    type=str,
    location="args",
    help="Application deadline to create info",
)
info_patch_args.add_argument(
    "courses", type=str, location="args", help="courses to create info"
)
info_patch_args.add_argument(
    "housing", type=str, location="args", help="housing to create info"
)
info_patch_args.add_argument(
    "tuition", type=str, location="args", help="tuition to create info"
)
info_patch_args.add_argument(
    "visa", type=str, location="args", help="visa to create info"
)
info_patch_args.add_argument(
    "eligibility", type=str, location="args", help="eligibility to create info"
)
info_patch_args.add_argument(
    "requirements", type=str, location="args", help="requirements to create info"
)


class UniversityRes(Resource):
    @marshal_with(university_resource_fields)
    def get(self, university_id):
        stmt = (
            select(UniversityTable, CountryTable)
            .join(
                CountryTable, UniversityTable.country_code == CountryTable.country_code
            )
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
    def get(self):
        args = info_get_args.parse_args()
        university_id = args["university_id"]

        uni = db.get_or_404(
            UniversityTable,
            university_id,
            description=f"No Univerisity with the ID '{university_id}'.",
        )

        return db.get_or_404(
            InfoPageTable,
            uni.info_page_id,
            description=f"No university with the ID '{university_id}'.",
        )

    @marshal_with(university_with_info_resource_fields)
    def post(self):
        try:
            args = info_post_args.parse_args()
            university_id = args["university_id"]

            uni = db.get_or_404(
                UniversityTable,
                university_id,
                description=f"No Univerisity with the ID '{university_id}'.",
            )
            if uni.info_page_id is not None:
                abort(
                    message="Information page already existed with provided university_id, use PATCH instead",
                    http_status_code=400,
                )

            new = InfoPageTable(
                info_page_id=str(uuid4()),
                webpage=args["webpage"],
                introduction=args["introduction"],
                location=args["location"],
                semester=args["semester"],
                application_deadline=args["application_deadline"],
                courses=args["courses"],
                housing=args["housing"],
                tuition=args["tuition"],
                visa=args["visa"],
                eligibility=args["eligibility"],
                requirements=args["requirements"],
            )

            db.session.add(new)
            db.session.commit()

            uni.info_page_id = new.info_page_id
            db.session.commit()

            return new, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(university_with_info_resource_fields)
    def patch(self):
        try:
            args = info_patch_args.parse_args()
            info_page_id = args["info_page_id"]
            info_page = (
                db.session.query(InfoPageTable)
                .filter_by(info_page_id=info_page_id)
                .first()
            )

            if "info_page_id" in args and args["info_page_id"] is not None:
                info_page.info_page_id = args["info_page_id"]
            if "webpage" in args and args["webpage"] is not None:
                info_page.webpage = args["webpage"]
            if "introduction" in args and args["introduction"] is not None:
                info_page.introduction = args["introduction"]
            if "location" in args and args["location"] is not None:
                info_page.location = args["location"]
            if "semester" in args and args["semester"] is not None:
                info_page.semester = args["semester"]
            if (
                "application_deadline" in args
                and args["application_deadline"] is not None
            ):
                info_page.application_deadline = args["application_deadline"]
            if "courses" in args and args["courses"] is not None:
                info_page.courses = args["courses"]
            if "housing" in args and args["housing"] is not None:
                info_page.housing = args["housing"]
            if "tuition" in args and args["tuition"] is not None:
                info_page.tuition = args["tuition"]
            if "visa" in args and args["visa"] is not None:
                info_page.visa = args["visa"]
            if "eligibility" in args and args["eligibility"] is not None:
                info_page.eligibility = args["eligibility"]
            if "requirements" in args and args["requirements"] is not None:
                info_page.requirements = args["requirements"]

            db.session.commit()
            return info_page, 200

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

            new_uni = UniversityTable(
                university_id=str(uuid4()),
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
            uni = (
                db.session.query(UniversityTable).filter_by(university_id=uniid).first()
            )
            # if 'university_id' in args and args['university_id'] is not None:
            #     uni.university_id = args['university_id']
            if "country_code" in args and args["country_code"] is not None:
                uni.country_code = args["country_code"]
            if "region" in args and args["region"] is not None:
                uni.region = args["region"]
            if "long_name" in args and args["long_name"] is not None:
                uni.long_name = args["long_name"]
            if "ranking" in args and args["ranking"] is not None:
                uni.ranking = args["ranking"]
            if "info_page_id" in args and args["info_page_id"] is not None:
                uni.info_page_id = args["info_page_id"]
            if "campus" in args and args["campus"] is not None:
                uni.campus = args["campus"]
            if "housing" in args and args["housing"] is not None:
                uni.housing = args["housing"]
            db.session.commit()
            return uni, 200

        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = uni_delete_args.parse_args()
            university_id = args["university_id"]
            uni = db.get_or_404(
                UniversityTable,
                university_id,
                description=f"No Univerisity with the ID '{university_id}'.",
            )
            db.session.delete(uni)
            db.session.commit()
            print(f"University with uni_id '{university_id}' deleted successfully")
            return {
                "message": f"University with uni_id '{university_id}' deleted successfully"
            }, 200
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
            res = db.paginate(
                select(UniversityTable).where(
                    UniversityTable.long_name.contains(search_word)
                ),
                per_page=5,
                page=page_number,
            )
        return {"hasMore": res.has_next, "items": [r for r in res]}, 200
