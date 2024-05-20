from flask_restful import Resource
from flask import jsonify
import pandas as pd
from database.database_setup import db
from sqlalchemy import text

class getExchangeData(Resource):
    def get(self):
        try:
            exchange_data = pd.read_excel('exchange.xlsx', header=0)

            # Group the data by country
            grouped_data = exchange_data.groupby(exchange_data.columns[0])

            # Convert grouped data to JSON
            json_data = {}

            for country, group_data in grouped_data:
                country = country[0] + country[1:].lower()
                country_data = []
                for index, row in group_data.iterrows():
                    university_name = row[1]  # Assuming university name is in the second column
                    university_info = {university_name: row[2:].to_dict()}
                    country_data.append(university_info)
                json_data[country] = country_data

            return jsonify(json_data)

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
class getRanking(Resource):
    def get(self):
        try:
            ranking_data = pd.read_csv('ranking.csv', usecols=[0, 1, 16], header=0)

            # Initialize JSON data structure
            json_data = []

            # SQL Insert query template
            insert_query = "INSERT INTO uni_ranking uni_name, uni_rank, uni_url VALUES :uni_name, :uni_rank, :uni_url"

            # Iterate over each row in the DataFrame
            for index, row in ranking_data.iterrows():
                ranking = row[0]
                university_name = row[1]
                url = row[2]

                # Create a dictionary for the current row
                university_info = {
                    'uni_name': university_name,
                    'uni_rank': ranking,
                    'uni_url': url
                }

                # Add the dictionary to the json_data list
                json_data.append(university_info)
                # Execute the SQL insert query
                db.session.execute(text(insert_query), {"uni_name": university_name, "uni_rank": ranking, "uni_url": url})

            # Commit the transaction
            db.session.commit()

            return jsonify(json_data)
        except Exception as e:
            return jsonify({'error': str(e)}), 500