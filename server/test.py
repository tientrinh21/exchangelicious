import pandas as pd
from flask import Flask, jsonify

# Read the Excel file
exchange_data = pd.read_excel('exchange.xlsx', header=0)  # Assuming the file is named exchange.xlsx

# # Convert the data to JSON
# exchange_data_json = exchange_data.to_json(orient='records')

# print(exchange_data_json)

# Group the data by country
grouped_data = exchange_data.groupby(exchange_data.columns[0])

# Iterate over each group
for country, group_data in grouped_data:
    # Print the country name
    print(country)
    # Print the data for the current country
    print(group_data)