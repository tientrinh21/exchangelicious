from sqlalchemy import URL, create_engine, text

# mysql://username:password@host:port/database_name

url_object = URL.create(
    "mysql+mysqlconnector",
    username="admin",
    password="admin",  # plain (unescaped) text
    host="localhost",
    port="3306",
    database="exchangedb",
)

engine = create_engine(url_object)

# Test the connection
connection = engine.connect()

result = connection.execute(text("SELECT * FROM user;"))
for row in result:
    print(row)
# username = 'admin'
# password = 'admin'
# host = 'localhost'
# port = '3306'
# database_name = 'uni-pov-exchange-db'
# #db_conn_str = "mysql+pymysql://exchange:Unipovex8@server8-sample.database.windows.net/exdb?charset=utf8mb4"
# db_conn_str = 'mysql+pymysql://' + username + ':' + password + '@' + host + ':' + port + '/' + database_name


# engine = create_engine(db_conn_str)
