from flask_restful import Resource, marshal_with, reqparse, abort
from resources_api.resource_fields_definitions import (
    review_resource_fields,
    review_paginate_resource_fields,
    upvote_resource_fields,
    downvote_resource_fields,
)
from database.database_setup import db
from database.models import ReviewTable, UpvoteTable, DownvoteTable, UserTable

from sqlalchemy import select, exc
from datetime import datetime
import uuid


class ReviewPerUniPaginateRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            "page_number", type=int, default=1, location="args", required=True
        )
        self.reqparse.add_argument(
            "university_id", type=str, location="args", required=True
        )
        self.reqparse.add_argument(
            "order_by", type=str, location="args", required=False
        )
        self.reqparse.add_argument("user_id", type=str, location="args", required=False)

    @marshal_with(review_paginate_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        university_id = args["university_id"]
        page_number = args["page_number"]
        order_by = args["order_by"]

        # order based on votes or new/old reviews
        if order_by == "new":
            order_stmt = ReviewTable.submit_datetime.desc()
        elif order_by == "old":
            order_stmt = ReviewTable.submit_datetime
        else:
            order_stmt = (ReviewTable.upvotes - ReviewTable.downvotes).desc()

        res = db.paginate(
            select(ReviewTable)
            .where(ReviewTable.university_id == university_id)
            .order_by(order_stmt),
            per_page=10,
            page=page_number,
        )

        items = res

        for i in items:
            uni = db.get_or_404(
                UserTable,
                i.user_id,
                description=f"No Univerisity with the ID '{university_id}'.",
            )
            i.username = uni.username

        if "user_id" in args and args["user_id"] != None:
            user_id = args["user_id"]
            items: list[dict[str, any]] = []
            r: ReviewTable
            for r in res:
                # check if the user has upvoted the current review
                stmt = (
                    select(UpvoteTable)
                    .where(
                        UpvoteTable.user_id == user_id,
                        UpvoteTable.review_id == r.review_id,
                    )
                    .limit(1)
                )
                ans_upvoted = db.session.scalar(stmt)
                has_upvoted = True if (ans_upvoted is not None) else False
                # check if the user has downvoted the current review
                # A user can either upvote or downvote, not both
                ans_downvoted = None
                if not has_upvoted:
                    stmt = (
                        select(DownvoteTable)
                        .where(
                            DownvoteTable.user_id == user_id,
                            DownvoteTable.review_id == r.review_id,
                        )
                        .limit(1)
                    )
                    ans_downvoted = db.session.scalar(stmt)
                has_downvoted = True if (ans_downvoted is not None) else False
                # add the newfound information to the return
                r_dict: dict = r.__dict__
                r_dict["has_upvoted"] = has_upvoted
                r_dict["has_downvoted"] = has_downvoted
                items.append(r_dict)
        return {"hasMore": res.has_next, "items": [i for i in items]}, 200


class ReviewRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.review_get_args = reqparse.RequestParser()
        self.review_get_args.add_argument(
            "review_id",
            type=str,
            location="args",
            required=True,
            help="ID of the review to be fetched",
        )

        self.review_put_args = reqparse.RequestParser()
        self.review_put_args.add_argument(
            "user_id",
            type=str,
            location="json",
            help="The user ID of the author of the review",
            required=True,
        )
        self.review_put_args.add_argument(
            "university_id",
            type=str,
            location="json",
            help="The ID of the university to review",
            required=True,
        )
        self.review_put_args.add_argument(
            "title",
            type=str,
            location="json",
            help="The title of the review",
            required=True,
        )
        self.review_put_args.add_argument(
            "content",
            type=str,
            location="json",
            help="The text/content of the review",
            required=True,
        )
        self.review_put_args.add_argument(
            "mood_score",
            type=str,
            location="json",
            help="The mood score of the review. Should be one of the enum values",
            required=True,
        )

        self.review_update_args = reqparse.RequestParser()
        self.review_update_args.add_argument(
            "review_id",
            type=str,
            location="args",
            required=True,
            help="ID of the review to be updated",
        )
        self.review_update_args.add_argument(
            "title", type=str, location="json", help="The title of the review"
        )
        self.review_update_args.add_argument(
            "content", type=str, location="json", help="The text/content of the review"
        )
        self.review_update_args.add_argument(
            "mood_score",
            type=str,
            location="json",
            help="The mood score of the review. Should be one of the enum values",
        )

        self.review_delete_args = reqparse.RequestParser()
        self.review_delete_args.add_argument(
            "review_id",
            type=str,
            location="args",
            required=True,
            help="ID of the review to be deleted",
        )

    @marshal_with(review_resource_fields)
    def get(self):
        args = self.review_get_args.parse_args()
        review_id = args["review_id"]
        return db.get_or_404(
            ReviewTable, review_id, description=f"No review with the ID '{review_id}'."
        )

    @marshal_with(review_resource_fields)
    def post(self):
        try:
            args = self.review_put_args.parse_args()
            new_review = ReviewTable(
                # generate id
                review_id=str(uuid.uuid4()),
                university_id=args["university_id"],
                user_id=args["user_id"],
                title=args["title"],
                content=args["content"],
                submit_datetime=datetime.now(),
                last_edit_datetime=None,
                mood_score=args["mood_score"],  # Enum?
            )
            db.session.add(new_review)
            db.session.commit()
            return new_review, 201
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    @marshal_with(review_resource_fields)
    def patch(self):
        try:
            args = self.review_update_args.parse_args()
            review_id = args["review_id"]
            review = db.get_or_404(
                ReviewTable,
                review_id,
                description=f"No review with the ID '{review_id}'.",
            )
            if "title" in args:
                review.title = args["title"]
            if "content" in args:
                review.content = args["content"]
            if "mood_score" in args:
                review.mood_score = args["mood_score"]

            review.last_edit_datetime = datetime.now()

            db.session.commit()
            return review, 200

        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = self.review_delete_args.parse_args()
            review_id = args["review_id"]
            review = db.get_or_404(
                ReviewTable,
                review_id,
                description=f"No review with the ID '{review_id}'.",
            )
            db.session.delete(review)
            db.session.commit()
            return {
                "message": f"Review with ID '{review_id}' was deleted successfully"
            }, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)


class UpvoteRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            "review_id", type=str, location="args", required=True
        )
        self.reqparse.add_argument(
            "user_id",
            type=str,
            location="args",
            required=True,
            help="ID of the review to be fetched",
        )

    @marshal_with(upvote_resource_fields)
    def post(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]

            # Add new upvote
            new = UpvoteTable(
                # generate id
                upvote_id=str(uuid.uuid4()),
                review_id=review_id,
                user_id=user_id,
            )
            db.session.add(new)
            db.session.commit()

            # remove potential old downvote
            stmt = select(DownvoteTable).where(
                DownvoteTable.user_id == user_id, DownvoteTable.review_id == review_id
            )
            old = db.session.scalar(stmt)
            if old is not None:
                db.session.delete(old)
                db.session.commit()

            return new, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]
            stmt = select(UpvoteTable).where(
                UpvoteTable.user_id == user_id, UpvoteTable.review_id == review_id
            )
            res = db.session.scalar(stmt)
            if res is None:
                abort(
                    message="No upvote matches the user and review combination. No upvote to be deleted",
                    http_status_code=400,
                )
            db.session.delete(res)
            db.session.commit()
            return {"message": "The upvote was deleted successfully"}, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)


class DownvoteRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            "review_id", type=str, location="args", required=True
        )
        self.reqparse.add_argument(
            "user_id",
            type=str,
            location="args",
            required=True,
            help="ID of the review to be fetched",
        )

    @marshal_with(downvote_resource_fields)
    def post(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]

            # Add new downvote
            new = DownvoteTable(
                # generate id
                downvote_id=str(uuid.uuid4()),
                review_id=review_id,
                user_id=user_id,
            )
            db.session.add(new)
            db.session.commit()

            # remove potential old upvote
            stmt = select(UpvoteTable).where(
                UpvoteTable.user_id == user_id, UpvoteTable.review_id == review_id
            )
            old = db.session.scalar(stmt)
            if old is not None:
                db.session.delete(old)
                db.session.commit()
            return new, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

    def delete(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]
            stmt = select(DownvoteTable).where(
                DownvoteTable.user_id == user_id, DownvoteTable.review_id == review_id
            )
            res = db.session.scalar(stmt)
            if res is None:
                abort(
                    message="No downvote matches the user and review combination. No downvote to be deleted",
                    http_status_code=400,
                )
            db.session.delete(res)
            db.session.commit()
            return {"message": "The downvote was deleted successfully"}, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)
