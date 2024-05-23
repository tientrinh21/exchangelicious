from resources_api.users import UserRes, UsersAllRes, UserWithUniversityRed
from resources_api.universities import UniversityPagination, UniversityRes,  UniversityWithInfoRes, UniversityAllRes
from resources_api.review_section import ReviewPerUniPaginateRes, ReviewRes, ReviewPerUniAllRes

def initialize_routes(api):
    # register the resource at a certain route
    # beware. The address should not end with a slash
    api.add_resource(UserRes, "/api/users/<string:user_id>")
    api.add_resource(UsersAllRes, "/api/users")
    api.add_resource(UniversityRes, "/api/universities/<string:university_id>")
    api.add_resource(
        UniversityWithInfoRes, "/api/universities/<string:university_id>/info"
    )
    api.add_resource(UniversityAllRes, "/api/universities")
    api.add_resource(UserWithUniversityRed, "/api/users/<string:user_id>/uni")
    api.add_resource(UniversityPagination, "/api/universities/search")
    # Reviews
    api.add_resource(ReviewRes, "/api/review")
    # api.add_resource(ReviewPerUniRes, "/api/reviews/<string:university_id>")
    api.add_resource(ReviewPerUniAllRes, "/api/reviews")
    api.add_resource(ReviewPerUniPaginateRes, "/api/reviews/paginate")