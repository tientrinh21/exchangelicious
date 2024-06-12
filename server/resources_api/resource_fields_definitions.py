from flask_restful import fields
from enum import Enum

class MoodScore(str, Enum):
    VERY_BAD = 'very bad'
    BAD = "bad"
    NEUTRAL = "neutral"
    GOOD = 'good'
    VERY_GOOD = 'very good'

# handle serialization
university_resource_fields = {
    "university_id": fields.String,
    "country_name": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "ranking": fields.String,
    "campus": fields.String,
    "housing": fields.Boolean,
}

university_meta_table_resource_fields = {
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "ranking": fields.String,
    "info_page_id": fields.String,
    "campus": fields.String,
    "housing": fields.Boolean,
}

university_with_info_resource_fields = {
    "info_page_id": fields.String,
    "webpage": fields.String,
    "introduction": fields.String,
    "location": fields.String,
    "semester": fields.String,
    "application_deadline": fields.String,
    "courses": fields.String,
    "housing": fields.String,
    "tuition": fields.String,
    "visa": fields.String,
    "eligibility": fields.String,
    "requirements": fields.String,
}

search_universities_resource_fields = {
    "hasMore": fields.Boolean,
    "items": fields.List(fields.Nested(university_meta_table_resource_fields)),
}

user_resource_fields = {
    "user_id": fields.String,
    "username": fields.String,
    "pwd": fields.String,
    "nationality": fields.String,
    "home_university": fields.String,
}

user_with_university_resource_fields = {
    "user_id": fields.String,
    "username": fields.String,
    "pwd": fields.String,
    "nationality": fields.String,
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
    "campus": fields.String,
    "ranking": fields.Integer,
    "housing": fields.Boolean,
}

# Reviews 
review_resource_fields = {
    "review_id": fields.String,
    "university_id": fields.String,
    "user_id": fields.String,
    "title": fields.String,
    "content": fields.String,
    "submit_datetime": fields.DateTime,
    "last_edit_datetime": fields.DateTime,
    "mood_score": fields.String, # TODO: Is this correct? Enum??
    "upvotes": fields.String,
    "downvotes": fields.String
}

review_nested_resource_fields = {
    "review_id": fields.String,
    "university_id": fields.String,
    "user_id": fields.String,
    "title": fields.String,
    "content": fields.String,
    "submit_datetime": fields.DateTime,
    "last_edit_datetime": fields.DateTime,
    "mood_score": fields.String, # TODO: Is this correct? Enum??
    "upvotes": fields.String,
    "downvotes": fields.String,
    "has_upvoted": fields.Boolean,
    "has_downvoted": fields.Boolean
}

review_paginate_resource_fields = {
    "hasMore": fields.Boolean,
    "items": fields.List(fields.Nested(review_nested_resource_fields)),
}

upvote_resource_fields = {
    "upvote_id": fields.String,
    "user_id": fields.String,
    "review_id": fields.String,
}

downvote_resource_fields = {
    "downvote_id": fields.String,
    "user_id": fields.String,
    "review_id": fields.String,
}

