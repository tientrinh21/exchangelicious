from flask_restful import fields
from enum import Enum

class MoodScore(str, Enum):
    VERY_BAD = 'very bad'
    BAD = "bad"
    NEUTRAL = "neutral"
    GOOD = 'good'
    VERY_GOOD = 'very good'

# handle serialization
info_page_resource_fields = {
    "info_page_id": fields.String,
    "intro_text": fields.String,
    "intro_source": fields.String,
}

university_resource_fields = {
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
}

university_with_info_resource_fields = {
    "university_id": fields.String,
    "country_code": fields.String,
    "region": fields.String,
    "long_name": fields.String,
    "info_page_id": fields.String,
    "info_page_id": fields.String,
    "intro_text": fields.String,
    "intro_source": fields.String,
}

search_universities_resource_fields = {
    "hasMore": fields.Boolean,
    "items":  fields.List(fields.Nested(university_resource_fields))
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
}


review_resource_fields = {
    "review_id": fields.String,
    "university_id": fields.String,
    "user_id": fields.String,
    "title": fields.String,
    "content": fields.String,
    "submit_datetime": fields.DateTime,
    "last_edit_datetime": fields.DateTime,
    "mood_score": fields.String, # TODO: Is this correct? Enum??
    "up_vote": fields.Integer,
    "down_vote": fields.Integer,
}

reply_resource_fields = {
    "reply_id": fields.String,
    "user_id": fields.String,
    "content": fields.String,
    "parent_review_id": fields.String,
}


