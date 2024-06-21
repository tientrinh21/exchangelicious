import uuid

from database.database_setup import db
from database.models import UniversityTable, FavoriteTable, CountryTable
from flask_restful import Resource, abort, marshal_with, reqparse
from resources_api.resource_fields_definitions import (
    favorite_table_resource_fields,
    favorite_paginate_resource_fields,
)
from sqlalchemy import select, exc


class FavoriteRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.paginate_args = reqparse.RequestParser()
        self.paginate_args.add_argument(
            "page_number", type=int, default=1, location="args", required=True
        )
        self.paginate_args.add_argument(
            "user_id", type=str, location="args", required=False
        )

        self.post_args = reqparse.RequestParser()
        self.post_args.add_argument("user_id", type=str, location="json", required=True)
        self.post_args.add_argument(
            "university_id", type=str, location="json", required=True
        )

        self.delete_args = reqparse.RequestParser()
        self.delete_args.add_argument(
            "favorite_id", type=str, location="args", required=True
        )

    @marshal_with(favorite_paginate_resource_fields)
    def get(self):
        args = self.paginate_args.parse_args()
        page_number = args["page_number"]
        user_id = args["user_id"]

        # it proved hard to join tables in this paginate function, therefore I had to join the table in several steps below
        # Paginate over the favorite table
        pagination_results = db.paginate(
            select(FavoriteTable).where(FavoriteTable.user_id == user_id),
            per_page=10,
            page=page_number,
        )

        # For all rows in pagination_result join with more UniversityTable and CountryTable so we get all information
        full_page_joined = []
        for favorite_table_row in pagination_results:
            stmt = (
                select(FavoriteTable, UniversityTable, CountryTable)
                .join(
                    UniversityTable,
                    FavoriteTable.university_id == UniversityTable.university_id,
                )
                .join(
                    CountryTable,
                    CountryTable.country_code == UniversityTable.country_code,
                )
                .where(FavoriteTable.university_id == favorite_table_row.university_id)
            )
            res_row_joined = db.session.execute(stmt).first()
            full_page_joined.append(res_row_joined)

        # Handel serialization
        full_output: list = []
        for table_type in full_page_joined:
            output: dict = {}
            for table in table_type:
                for key, value in table.__dict__.items():
                    output[key] = value
            full_output.append(output)

        return {"hasMore": pagination_results.has_next, "items": full_output}, 200

    @marshal_with(favorite_table_resource_fields)
    def post(self):
        try:
            args = self.post_args.parse_args()
            new = FavoriteTable(
                favorite_id=str(uuid.uuid4()),
                user_id=args["user_id"],
                university_id=args["university_id"],
            )
            db.session.add(new)
            db.session.commit()
            return new, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = self.delete_args.parse_args()
            favorite_id = args["favorite_id"]
            favorite = db.get_or_404(
                FavoriteTable,
                favorite_id,
                description=f"No favorite-combination with the ID '{favorite_id}'.",
            )
            db.session.delete(favorite)
            db.session.commit()
            return {
                "message": f"Favorite-combination with ID '{favorite_id}' was deleted successfully"
            }, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)
