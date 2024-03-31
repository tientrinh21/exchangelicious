from sqlalchemy import create_engine, text

db_conn_str = "mysql+pymysql://exchange:Unipovex8@server8-sample.database.windows.net/exdb?charset=utf8mb4"

engine = create_engine(db_conn_str)
