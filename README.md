# UniExchange

## Development guide

The current setup is inspired by this video: https://www.youtube.com/watch?v=OwxxCibSFKk
(main difference is he uses the page router and I use the newer app router)

### Prerequisites

- You need to have nodejs installed on your computer: https://nodejs.org/en
- and python of course

### Setup

- make sure you have created, activated and installed the relevant packages in your venv (see useful venv commandos)
- setup the front end:
- `cd client`
- `npm install`

### run the backend

- `cd server`
- `python server.py`
- in webbrowser, go to  `http://127.0.0.1:8080/api/home`

### run the frontend

- `cd client`
- `npm run dev`
- in webbrowser, go to `http://localhost:3000/`

### useful venv commandos

https://mothergeo-py.readthedocs.io/en/latest/development/how-to/venv-win.html

**You need to be in the server-folder**.

create your own virtual environment (venv):
`python -m venv .venv`


activate the venv (windows):
`.\venv\Scripts\activate`

install all necessary packages

`pip install -r requirements.txt`

update the requirements file (important when you install a package to the venv, that we all need):
`pip freeze > requirements.txt`

deactivate the venv:
`deactivate`
