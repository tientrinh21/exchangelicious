from flask_swagger_ui import get_swaggerui_blueprint

# Swagger setup - https://pypi.org/project/flask-swagger-ui/
# https://www.youtube.com/watch?v=AyyX9yM_OZk
SWAGGER_URL = ''  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/api_swagger_docs.json' # Our API url (can of course be a local resource)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "EduVenture Api Docs"
    }
)
