# Pictionary

A single-page-application (SPA) where one user draws a word and the other users should guess try to guess it.

[Live demo](https://nouamane-pictionary.herokuapp.com)

## Technical description
*  Backend : NodeJs with Express, Socket IO, Mongoose for Database.
*  Frontend : React, Axios for HTTP requests.
*  Linting : ESlint
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

## Running the tests

In the console, after installing eslint globally, run :
```
eslint ./
```

### Running the website

For development, run these two commands in two different consoles :

```
cd client && npm start
cd server && nodemon server
```

For production :

```
npm run dev
```

## Deployment

After 

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc