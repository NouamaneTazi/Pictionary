# Pictionary

A single-page-application (SPA) where one user draws a word and the other users should guess try to guess it.

[Live demo](https://nouamane-pictionary.herokuapp.com)

## Technical description
*  Back-end : NodeJs *(v10.16.3)* with Express, Socket IO, Mongoose for Database.
*  Front-end : React [Material UI](https://material-ui.com), Axios for HTTP requests.
*  Authentification : JWT signed token stored inside browser cookies.
*  Database : MongoDB
*  Linting : ESlint
*  Gitlab CI : For linting.
*  Deployment : Heroku

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites


For [nodemon](https://www.npmjs.com/package/nodemon) (a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.)

```
npm i -g nodemon
```
For ESlint

```
npm i -g eslint-cli
```
For deployment on heroku

```
npm i -g heroku
```
### Installing used Packages

A step by step series of examples that tell you how to get a development env running

We start by installing the Packages

```
npm run install
```

### Running the tests

In the console, after installing eslint globally, run :
```
eslint ./
```

### Running the website

For development, run these two commands in two different consoles :

>  To lunch the back-end
```
cd server && nodemon server
```
>  To lunch the front-end
```
cd client && npm start
```

For production : *(lunches both the back and the front)*

```
npm run dev
```

## Deployment

After logging in with your heroku account with `heroku login`, run in the console :

```
git add .
git commit -m "Initial commit"
git push heroku master
```
## App Usage

Some already existing accounts:
```
normal user >> username : user | password : user
admin >> username : admin | password : admin
```

### Features 
* [x]  Show error messages if user already connected or wrong credentials.
* [x]  Being able to register. Displays error message if existing username.
* [x]  Keeps the authentification upon reloading page through a token that becomes invalid after a certain amount of time or upon logging out
* [x]  Add, join and delete own rooms if user, or all rooms if admin.
* [x]  Add or remove the words' choices in the game if admin.
* [x]  Synchronise drawing in real time between users in same room.
* [x]  Chat feature in rooms.
* [x]  Check if correct guess, then mute this user.
* [x]  Timer in every room, that restarts every round or upon drawer leaving room. The game restarts upon 5 rounds.
* [x]  Show leaderboards in the end of a game. +1 point if user guessed correctly.
* [x]  Drawer can change colors and size of the brush, use the eraser or clear the canvas.
* [ ]  Responsive canvas size.
* [ ]  Improve score calculation method
* [ ]  Users who guessed the correct word can still chat but only among them and the drawer.
* [ ]  Validate authentification's data before processing it for more security.
* [ ]  Show what's been drawn for a recently joined user


## Author

* Nouamane Tazi


## Acknowledgments

* Hat tip to [DTY - CentraleSupélec](https://paris-digital-lab.com) for supervising this project.