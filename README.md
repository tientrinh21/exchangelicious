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
- In web browser, go to  `http://127.0.0.1:8080/api/home`

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

## Database connection
The current database connection is inspired by this video: https://www.youtube.com/watch?v=yBDHkveJUf4&ab_channel=freeCodeCamp.org (2:36:51)
We are using Microsoft Azure cloud & MySQL. 
