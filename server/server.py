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
        # Read the Excel file
        exchange_data = pd.read_excel('exchange.xlsx')  # Assuming the file is named exchange.xlsx

        # Convert the data to JSON
        exchange_data_json = exchange_data.to_json(orient='records')

        return exchange_data_json

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)