import json
from flask_restful import Resource, marshal_with, reqparse, abort
from resources_api.resource_fields_definitions import reply_resource_fields, review_resource_fields
from database.database_setup import db
from database.models import ReviewTable, ReplyTable
# from database.models import review_schema, reviews_schema
from sqlalchemy import select, exc, text
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
#review_put_args.add_argument('up_vote', type=str, location = "args", help='Home university of user')
#review_put_args.add_argument('down_vote', type=str, location = "args", help='Home university of user')

review_update_args = reqparse.RequestParser()
review_update_args.add_argument('review_id', type=str, location = "args", required=True, help='ID of the review to be updated')
review_update_args.add_argument('title', type=str, location = "args", help='The title of the review')
review_update_args.add_argument('content', type=str, location = "args", help='The text/content of the review')
review_update_args.add_argument('mood_score', type=str, location = "args", help='The mood score of the review. Should be one of the enum values')

review_delete_args = reqparse.RequestParser()
review_delete_args.add_argument('review_id', type=str, location = "args", required=True, help='ID of the review to be deleted')

class ReviewPerUniRes(Resource):
    @marshal_with(review_resource_fields)
    def get(self):
        args = review_per_uni_get_args.parse_args()
        university_id = args["university_id"]
        statement = select(ReviewTable).where(ReviewTable.university_id == university_id)
        res = db.session.scalars(statement).all()
        return [r for r in res], 200
        # return reviews_schema.dump(res), 200

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
                up_vote=0,
                down_vote=0
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


# find all reviews for a university
# upvote/downvote

        
    
    
