from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from database.database_setup import db, get_database_uri
from swagger_setup import swaggerui_blueprint
from resources_api.routes import initialize_routes

app = Flask(__name__)

CORS(app)
# Swagger Docs
app.register_blueprint(swaggerui_blueprint)

# Database
app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
db.init_app(app)

# api
api = Api(app)
initialize_routes(api)


if __name__ == "__main__":
    app.run(debug=True, port=8080)
