import json
from flask_restful import Resource, marshal_with, reqparse, abort
from resources_api.resource_fields_definitions import reply_resource_fields, review_resource_fields, review_paginate_resource_fields, upvote_resource_fields, downvote_resource_fields
from database.database_setup import db
from database.models import ReviewTable, UpvoteTable, DownvoteTable
# from database.models import review_schema, reviews_schema
from sqlalchemy import func, select, exc
from sqlalchemy.orm import aliased
from datetime import datetime
import uuid


review_per_uni_get_args = reqparse.RequestParser()
review_per_uni_get_args.add_argument('university_id', type=str, location = "args", required=True, help='ID of the review to be fetched')

review_get_args = reqparse.RequestParser()
review_get_args.add_argument('review_id', type=str, location = "args", required=True, help='ID of the review to be fetched')

review_put_args = reqparse.RequestParser()
review_put_args.add_argument('user_id', type=str, location = "args", help='The user ID of the author of the review', required=True)
review_put_args.add_argument('university_id', type=str, location = "args", help='The ID of the university to review', required=True)
review_put_args.add_argument('title', type=str, location = "args", help='The title of the review', required=True)
review_put_args.add_argument('content', type=str, location = "args", help='The text/content of the review', required=True)
#review_put_args.add_argument('submit_datetime', type=str, location = "args", help='Home university of user')
review_put_args.add_argument('mood_score', type=str, location = "args", help='The mood score of the review. Should be one of the enum values', required=True)
#review_put_args.add_argument('upvote', type=str, location = "args", help='Home university of user')
#review_put_args.add_argument('downvote', type=str, location = "args", help='Home university of user')

review_update_args = reqparse.RequestParser()
review_update_args.add_argument('review_id', type=str, location = "args", required=True, help='ID of the review to be updated')
review_update_args.add_argument('title', type=str, location = "args", help='The title of the review')
review_update_args.add_argument('content', type=str, location = "args", help='The text/content of the review')
review_update_args.add_argument('mood_score', type=str, location = "args", help='The mood score of the review. Should be one of the enum values')

review_delete_args = reqparse.RequestParser()
review_delete_args.add_argument('review_id', type=str, location = "args", required=True, help='ID of the review to be deleted')

class ReviewPerUniAllRes(Resource):
    @marshal_with(review_resource_fields)
    def get(self):
        args = review_per_uni_get_args.parse_args()
        university_id = args["university_id"]
        statement = select(ReviewTable).where(ReviewTable.university_id == university_id)
        res = db.session.scalars(statement).all()
        return [r for r in res], 200
        # return reviews_schema.dump(res), 200

class ReviewPerUniPaginateRes(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            "page_number", type=int, default=1, location="args", required=True
        )
        self.reqparse.add_argument('university_id', type=str, location = "args", required=True, help='ID of the review to be fetched')

    # @marshal_with(review_paginate_resource_fields)
    # def get(self):
    #     args = self.reqparse.parse_args()
    #     university_id = args["university_id"]
    #     page_number = args["page_number"]
    #     # TODO: Should be able to order based on votes or new/old
    #     res = db.paginate(
    #         select(ReviewTable).where(ReviewTable.university_id == university_id),
    #         # .order_by((ReviewTable.upvote - ReviewTable.downvote).desc()),
    #         per_page=4,
    #         page=page_number
    #     )
    #     return {"hasMore": res.has_next, "items": [r for r in res]}, 200

    @marshal_with(review_paginate_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        university_id = args["university_id"]
        page_number = args["page_number"]

        upvote_alias = aliased(UpvoteTable)
        downvote_alias = aliased(DownvoteTable)

        # Subqueries to count upvotes and downvotes
        upvote_count = db.session.query(
            ReviewTable.review_id,
            func.count(upvote_alias.upvote_id).label('upvote_count')
        ).join(upvote_alias, upvote_alias.review_id == ReviewTable.review_id, isouter=True).group_by(ReviewTable.review_id).subquery()

        print(upvote_count)

        downvote_count = db.session.query(
            ReviewTable.review_id,
            func.count(downvote_alias.downvote_id).label('downvote_count')
        ).join(downvote_alias, downvote_alias.review_id == ReviewTable.review_id, isouter=True).group_by(ReviewTable.review_id).subquery()

        print(downvote_count)

        # Main query with pagination and sorting by vote difference
        query = db.session.query(
            ReviewTable,
            (func.coalesce(upvote_count.c.upvote_count, 0) - func.coalesce(downvote_count.c.downvote_count, 0)).label('vote_diff')
        ).outerjoin(upvote_count, upvote_count.c.review_id == ReviewTable.review_id)\
        .outerjoin(downvote_count, downvote_count.c.review_id == ReviewTable.review_id)\
        .filter(ReviewTable.university_id == university_id)\
        .order_by(func.coalesce(upvote_count.c.upvote_count, 0) - func.coalesce(downvote_count.c.downvote_count, 0).desc())

        print(" ")
        print(query)

        # Apply pagination
        res = query.paginate(page=page_number, per_page=4, error_out=False)

        print("")

        res_updated = []
        for r in res.items:
            print(type(r[0]))
            print(r[0])
        return {"hasMore": res.has_next, "items":  for r in res.items]}, 200

    # def get(self):
    #     args = self.reqparse.parse_args()
    #     university_id = args["university_id"]
    #     page_number = args["page_number"]

    #     up_stmt = (
    #         select(UpvoteTable)
    #         .where(UpvoteTable.university_id == university_id, UpvoteTable.university_id == university_id)
    #         .with_only_columns[]
    #     )
        

class ReviewRes(Resource):
    @marshal_with(review_resource_fields)
    def get(self):
        args = review_get_args.parse_args()
        review_id = args["review_id"]
        return db.get_or_404(ReviewTable, review_id, description=f"No review with the ID '{review_id}'.")
    
    @marshal_with(review_resource_fields)
    def put(self):
        try:
            args = review_put_args.parse_args()
            new_review = ReviewTable(
                # generate id
                review_id = str(uuid.uuid4()),
                university_id=args['university_id'],
                user_id=args['user_id'],
                title=args['title'],
                content=args['content'],
                submit_datetime = datetime.now(),
                last_edit_datetime = None,
                mood_score=args['mood_score'], # Enum?
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
            args = review_update_args.parse_args()
            review_id = args["review_id"]
            review = db.get_or_404(ReviewTable, review_id, description=f"No review with the ID '{review_id}'.")
            if 'title' in args:
                review.title = args['title']
            if 'content' in args:
                review.content = args['content']
            if 'mood_score' in args:
                review.mood_score = args['mood_score']
            
            review.last_edit_datetime = datetime.now()

            db.session.commit()
            return review, 200

        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)
    
    def delete(self):
        try:
            args = review_delete_args.parse_args()
            review_id = args["review_id"]
            review = db.get_or_404(ReviewTable, review_id, description=f"No review with the ID '{review_id}'.")
            db.session.delete(review)
            db.session.commit()
            return {"message": f"Review with ID '{review_id}' was deleted successfully"}, 200
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
        self.reqparse.add_argument('user_id', type=str, location = "args", required=True, help='ID of the review to be fetched')

    @marshal_with(upvote_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        review_id = args["review_id"]
        user_id = args["user_id"]

        stmt = (
            select(UpvoteTable).where(UpvoteTable.user_id == user_id, UpvoteTable.review_id == review_id)
        )
        res = db.session.scalar(stmt)
        print(res)
        return res, 200

    @marshal_with(upvote_resource_fields)
    def post(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]

            # stmt = (
            #     select(UpvoteTable).where(UpvoteTable.user_id == user_id, UpvoteTable.review_id == review_id)
            # )
            # print(stmt)
            # res = db.session.execute(stmt).all()
            # print(res)
            # for i in res:
            #     print(i)
            # if len(res) >= 1:
            #     abort(message="A user can only upvote a stat", http_status_code=400)

            new = UpvoteTable(
                # generate id
                upvote_id = str(uuid.uuid4()),
                review_id = review_id,
                user_id = user_id
            )
            db.session.add(new)
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
            stmt = (
                select(UpvoteTable).where(UpvoteTable.user_id == user_id, UpvoteTable.review_id == review_id)
            )
            print(stmt)
            res = db.session.scalar(stmt)
            print(res)
            if res is None:
                abort(message="No upvote matches the user and review combination. No upvote to be deleted", http_status_code=400)
            db.session.delete(res)
            db.session.commit()
            return {"message": f"The upvote was deleted successfully"}, 200
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
        self.reqparse.add_argument('user_id', type=str, location = "args", required=True, help='ID of the review to be fetched')

    @marshal_with(upvote_resource_fields)
    def get(self):
        args = self.reqparse.parse_args()
        review_id = args["review_id"]
        user_id = args["user_id"]

        stmt = (
            select(DownvoteTable).where(DownvoteTable.user_id == user_id, DownvoteTable.review_id == review_id)
        )
        res = db.session.scalars(stmt)
        print(res)
        return res, 200

    @marshal_with(upvote_resource_fields)
    def post(self):
        try:
            args = self.reqparse.parse_args()
            review_id = args["review_id"]
            user_id = args["user_id"]

            new = DownvoteTable(
                # generate id
                upvote_id = str(uuid.uuid4()),
                review_id = review_id,
                user_id = user_id
            )
            db.session.add(new)
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
            stmt = (
                select(DownvoteTable).where(DownvoteTable.user_id == user_id, DownvoteTable.review_id == review_id)
            )
            print(stmt)
            res = db.session.scalar(stmt)
            print(res)
            if res is None:
                abort(message="No downvote matches the user and review combination. No downvote to be deleted", http_status_code=400)
            db.session.delete(res)
            db.session.commit()
            return {"message": f"The downvote was deleted successfully"}, 200
        except exc.SQLAlchemyError as e:
            print(e)
            abort(message=str(e.__dict__.get("orig")), http_status_code=400)

# find all reviews for a university
# upvote/downvote (A user can only upvote a review once)
# Replies (with fetch more)
