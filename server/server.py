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

@app.route('/exch')
def get_exchange_data():
    try:
        exchange_data = pd.read_excel('exchange.xlsx', header=0)

        # Group the data by country
        grouped_data = exchange_data.groupby(exchange_data.columns[0])

        # Convert grouped data to JSON
        json_data = {}

        for country, group_data in grouped_data:
            country_data = []
            for index, row in group_data.iterrows():
                university_name = row[1]  # Assuming university name is in the second column
                university_info = {university_name: row[2:].to_dict()}
                country_data.append(university_info)
            json_data[country] = country_data

        return jsonify(json_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)