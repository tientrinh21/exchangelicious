from resources_api.users import UserRes, UsersAllRes, UserWithUniversityRed
from resources_api.universities import (
    UniversityPagination,
    UniversityRes,
    UniversityWithInfoRes,
    UniversityAllRes,
)


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
    api.add_resource(UserWithUniversityRes, "/api/users/<string:user_id>/uni")
    api.add_resource(UniversityPaginationRes, "/api/universities/search")
    api.add_resource(UserLoginRes, "/api/users/login")
