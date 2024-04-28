# Uni POV Exchange

## Development guide

The current setup is inspired by this video: https://www.youtube.com/watch?v=OwxxCibSFKk
(main difference is he uses the page router and I use the newer app router)

**⚠️ Please make a pull request instead of pushing straight to the main branch**

### Prerequisites

- You need to have Node.js installed on your computer: https://nodejs.org/en
- And python of course

### Setup

- Make sure you have created, activated and installed the relevant packages in your venv (see useful venv commandos)
- Setup the front end:
- `cd client`
- `npm install`

### Run the backend

- `cd server`
- `python server.py`
- In web browser, go to `http://127.0.0.1:8080/api/home`

### Run the frontend

- `cd client`
- `npm run dev`
- In web browser, go to `http://localhost:3000/`

### Useful venv commandos

https://mothergeo-py.readthedocs.io/en/latest/development/how-to/venv-win.html

**⚠️ You need to be in the server-folder**.

- Create your own virtual environment (venv):
  `python -m venv .venv`

- Activate the venv (windows):
  `.\venv\Scripts\activate`
  (mac):
  `source venv/bin/activate`

- Install all necessary packages:
  `pip install -r requirements.txt`

- Update the requirements file (important when you install a package to the venv, that we all need):

  `pip freeze > requirements.txt`

- Deactivate the venv:
  `deactivate`

## Local Database setup

1. Download and install the MySQL workbench

   - Windows: https://dev.mysql.com/downloads/windows/installer/8.0.html
   - mac: https://dev.mysql.com/downloads/workbench/
   - I followed [this youtube tutorial](https://www.youtube.com/watch?v=wgRwITQHszU). However, this probably install more than we need

2. Open the workbench and run the following sql-script:

   1. [countries.sql](server/database_schemas/countries.sql)
   2. [schema.sql](server/database_schemas/schema.sql)

3. Create your own _.env_ file withing the folder called _server_. It should contain the following:

```python
DB_USERNAME = 'root (or whatever you called your db user)'
DB_PASSWORD = 'the password of the user you created'
DB_SERVER = 'localhost'
DB_PORT = '3306'
DB_NAME = 'exchangeDB'
```

## Github Codespaces setup

Start a codespace on a branch. Then do the following to setup the databse:

- Run a MySQL Docker container with your choice of `[CONTAINER_NAME]` and `[PASSWORD]` for root user.

  `docker run --name [CONTAINER_NAME] -p 3306:3306 -e MYSQL_ROOT_PASSWORD=[PASSWORD] -d mysql:latest`

- Look for **"IPAddress"** after running `docker inspect [CONTAINER_NAME]`.
- Check if the database is running `docker run -it --rm mysql mysql -h [IP_ADDRESS] -u root -p`.
- Load SQL scripts to the database.

  `docker exec -i [CONTAINER_NAME] mysql -h [IP_ADDRESS] -u root -p[PASSWORD] < ./server/database_schemas/countries.sql`

  `docker exec -i [CONTAINER_NAME] mysql -h [IP_ADDRESS] -u root -p[PASSWORD] < ./server/database_schemas/schema.sql`

- Run setup as local development.

## Database connection

The current database connection is inspired by this video: https://www.youtube.com/watch?v=yBDHkveJUf4&ab_channel=freeCodeCamp.org (2:36:51).

We are using Microsoft AWS & MySQL.
