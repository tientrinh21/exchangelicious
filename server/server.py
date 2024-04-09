from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL, create_engine, text
from dotenv import load_dotenv
from db_helper_functions import INSERT_USER
import os

# loads the variables in the .env file so we can access them
load_dotenv()
# app instance
app = Flask(__name__)
CORS(app)

DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_SERVER = os.getenv("DB_SERVER")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

url_object = URL.create(
    "mysql+mysqlconnector",
    username=DB_USERNAME,
    password=DB_PASSWORD,  # plain (unescaped) text
    host=DB_SERVER,
    port=DB_PORT,
    database=DB_NAME,
)

app.config['SQLALCHEMY_DATABASE_URI'] = url_object
db = SQLAlchemy(app)

# docs: https://docs.sqlalchemy.org/en/20/core/connections.html#basic-usage
engine = create_engine(url_object)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.string, unique=True)
    password = db.Column(db.string)

    # to string
    def __repr__(self):
        return f'<User {self.username}>'
    

class User: 
    def __init__(self, id, username, password) -> None:
        self.id = id
        self.username = username
        self.password = password
    
    # deserialization
    @staticmethod
    def from_dict(data):
        return User(data.get('id'), data.get('username'), data.get('email'))

    # serialization
    def to_dict(self):
        return {"id": self.id, 'username': self.username, 'email': self.email}


@app.route('/api/home', methods=['GET'])
def return_home():
    return jsonify({
        'message': "hello world from the flask server!",
        'people': ['Jack', 'Harry', 'Barry']
    })



@app.route('/api/universities', methods=['GET'])
def get_all_universities():
    # closes the connection automatically when using the with block
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM University;"))

    return jsonify([(dict(row)) for row in result])
    # return {"id": 232, "message": f"Universities viewed created."}, 201

@app.post("/api/create/user")
def create_user():
    data = request.get_json()
    username = data["username"]
    homeUniID = data["homeUniID"]
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(INSERT_USER, (username, homeUniID))
            user_id = cursor.fetchone()[0]
    return {"id": user_id, "message": f"User {username} created."}, 201



if __name__ == '__main__':
    app.run(debug=True, port=8080)

