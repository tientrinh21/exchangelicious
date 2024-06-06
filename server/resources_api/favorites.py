import uuid

from flask import jsonify
from database.database_setup import db
from database.models import UniversityTable, FavoriteTable, CountryTable
from flask_restful import Resource, abort, marshal_with, reqparse
from resources_api.resource_fields_definitions import favorite_university_resource_fields, favorite_table_resource_fields
from sqlalchemy import func, select, exc, Row

class FavoriteRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.get_args = reqparse.RequestParser()
        self.get_args.add_argument("favorite_id", type=str, location="args", required=True)

        self.post_args = reqparse.RequestParser()
        self.post_args.add_argument("user_id", type=str, location="json", required=True)
        self.post_args.add_argument("university_id", type=str, location="json", required=True)

        self.delete_args = reqparse.RequestParser()
        self.delete_args.add_argument("favorite_id", type=str, location="args", required=True)

    
    @marshal_with(favorite_university_resource_fields)
    def get(self):
        args = self.get_args.parse_args()
        favorite_id = args["favorite_id"]

        stmt = (
            select(FavoriteTable, UniversityTable, CountryTable).select_from(FavoriteTable)
            .join(UniversityTable, FavoriteTable.university_id == UniversityTable.university_id)
            .join(CountryTable, CountryTable.country_code == UniversityTable.country_code)
            .where(FavoriteTable.favorite_id == favorite_id)
            .limit(1)
        )
        res = db.session.execute(stmt).first()

        if res is None:
            abort(
                message=f"No favorite-combination with the ID '{favorite_id}'.",
                http_status_code=404,
            )

        # fix serialization 
        output: dict = {}
        for r in res:
            for key, value in r.__dict__.items():
                output[key] = value

        return output, 200

    @marshal_with(favorite_table_resource_fields)
    def post(self):
        try:
            args = self.post_args.parse_args()
            new = FavoriteTable(
                favorite_id = str(uuid.uuid4()),
                user_id = args["user_id"],
                university_id = args["university_id"]
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
            favorite = db.get_or_404(FavoriteTable, favorite_id, description=f"No favorite-combination with the ID '{favorite_id}'.")
            db.session.delete(favorite)
            db.session.commit()
            return {"message": f"Favorite-combination with ID '{favorite_id}' was deleted successfully"}, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)
