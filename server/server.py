from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from database.database_setup import db, get_database_uri
import pandas as pd

app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
# Swagger Docs
from swagger_setup import swaggerui_blueprint
app.register_blueprint(swaggerui_blueprint)

# Database
app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
db.init_app(app)

# api
api = Api(app)
from resources_api.routes import initialize_routes
initialize_routes(api)

@app.route('/rank')   
def ranking():
    try:
        ranking_data = pd.read_csv('ranking.csv', usecols=[0, 1, 16], header=0)

        # Initialize JSON data structure
        json_data = []

        # Iterate over each row in the DataFrame
        for index, row in ranking_data.iterrows():
            ranking = row[0]
            university_name = row[1]
            url = row[2]

            # Create a dictionary for the current row
            university_info = {
                'ranking': ranking,
                'university_name': university_name,
                'url': url
            }

            # Add the dictionary to the json_data list
            json_data.append(university_info)

        return jsonify(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)