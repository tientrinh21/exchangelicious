from flask_restful import fields

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
    "webpage": fields.String,
    "introduction": fields.String,
    "location": fields.String,
    "semester": fields.String,
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


