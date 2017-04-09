[![Build Status](https://travis-ci.org/andela-vnwosu/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-vnwosu/document-management-system.svg?branch=develop)

[![Coverage Status](https://coveralls.io/repos/github/andela-vnwosu/document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/andela-vnwosu/document-management-system?branch=develop)

[![Code Climate](https://codeclimate.com/github/andela-vnwosu/document-management-system/badges/gpa.svg)](https://codeclimate.com/github/andela-vnwosu/document-management-system)


# document-management-system

Document Management System provides a restful API and friend users interface for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT. The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.

## Development
The application was developed with NodeJs and Express is used for routing. The Postgres database was used with sequelize as the ORM

## Installation
- Ensure you have NodeJs and postgres installed
- Clone the repository git clone https://github.com/andela-vnwosu/documentManagementSystem.git
- Change your directory cd document-management-system
- Install all dependencies npm install
- Run tests npm test
- Run integration test npm run e2e
- Start the app npm start and use postman to consume the API

## API ENDPOINTS

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8c67c8b3b129867b7efb)

### Users

- Request type	Endpoint	Action
- POST	/users	Create a new user
- GET	/users	Get all users
- GET	/users/:id	Get details of a specific user
- PUT	/users/:id	Edit user details
- DELETE	/users/:id	Remove a user from storage
- POST	/users/login	To log a user in
- GET	/users/documents	To get a users personal documents
- GET	/users/:id/documents	To get document of a specific user
- GET /search/users  To search for a user

### Roles

- Request type	Endpoint	Action
- POST	/roles	Create a new role
- GET	/roles	Get all created roles
- PUT	/role/:id	To edit a role
- DELETE	/role/:id	To delete a role
- GET	/role/:id	To get a role

### Documents

- Request type	Endpoint	Action
- POST	/documents	Create a new document
- GET	/documents	Retrieve all documents
- GET	/documents/:id	Retrieve a specific document
- PUT	/documents/:id	Update a specific document
- DELETE	/documents/:id	Remove a specific document from storage
- GET	/documents??offset=1&limit=10	Retrieve maximum of first 10 documents
- GET /search/documents  Search for a document

## Heroku App Link

- [visit] (https://markydoc-management-system.herokuapp.com/login)