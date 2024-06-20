# Exchangelicious

Savor the Flavor of Global Exchange!

<img src="https://i.imgur.com/oGYOwF5.png" alt="Hero image" style="border-radius: 10px"/>

## Local Development guide

The current setup is inspired by this video: https://www.youtube.com/watch?v=OwxxCibSFKk
(main difference is he uses the page router and I use the newer app router)

**⚠️ Please make a pull request instead of pushing straight to the main branch**

### Prerequisites

- You need to have Node.js installed on your computer: https://nodejs.org/en
- mysql
- And python of course

### Setup

1. Create your own _.venv_ with in the folder called _server_
   - Create your own virtual environment (venv):
     `python -m venv .venv`
   - Activate the venv (windows):
     `.\venv\Scripts\activate`
     (mac):
     `source venv/bin/activate`
   - Install all necessary packages:
     `pip install -r requirements.txt`
2. Create your own _.venv_ with in the folder called _uni-data_

   - repeat the commands above

3. Create your own _.env_ file with in the folder called _server_. It should contain the following:

```python
DB_USERNAME='root (or whatever you called your db user)'
DB_PASSWORD='the password of the user you created'
DB_SERVER='localhost'
DB_PORT='3306'
DB_NAME='exchangeDB'
```

4. Create your own _.env_ file with in the folder called _uni-data_.

   - It should contain the same information as above

5. To create the database and populate it with information. Run the following command in a bash shell (You need to be in the root folder _exchangelicious_):
   - `./setup_database.sh`

### Run the backend

- `cd server`
- `python server.py`
- In web browser, go to `http://127.0.0.1:8080/`

### Run the frontend

- `cd client`
- `npm install`
- In web browser, go to `http://127.0.0.1:3000/`

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

### How to download MySQL workbench

1. Download and install the MySQL workbench

   - Windows: https://dev.mysql.com/downloads/windows/installer/8.0.html
   - mac: https://dev.mysql.com/downloads/workbench/
   - I followed [this youtube tutorial](https://www.youtube.com/watch?v=wgRwITQHszU). However, this probably install more than we need

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
