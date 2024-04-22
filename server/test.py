import requests
import json

# Define the URL of your Flask application's endpoint
url = 'http://127.0.0.1:8080/api/users'

# Define the data to be sent in the PUT request (JSON format)
data = {
    "user_id": 'seoykwon',
    "username": "seoykwon",
    "pwd": "new_password",
    "nationality": "new_nationality",
    "home_university": "skku"
}

# Send the PUT request with the JSON data
response = requests.put(url, json=data)

# Print the response
print(response.status_code)
print(response.json())  # This will print the response body as JSON
