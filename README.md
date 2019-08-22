# Devspace

A full stack web app that allows web developers to easily create a basic portfolio site to introduce themselves and demo their skills and projects.

## Demo:

- [Devspace Live App](https://ryanjeske-devspace.herokuapp.com/)

## Built With

* Node.js
* Express
* PostgreSQL

## Client Repo:

- [Devspace](https://github.com/ryanjeske14/devspace)

## AUTH TOKEN

Protected endpoints require a valid auth token in the authorization header. In order to obtain an auth token, either register if you're a new user, or log in if you're an existing user, and find the auth token in your browser's local storage. 

For example, if using Google Chrome, log in to your Devspace account, open Chrome Developer Tools (Ctrl+Shift+I), navigate to the Application tab in the top nav bar, expand the Local Storage dropdown and select the option at https://https://ryanjeske-devspace.herokuapp.com/. If you are logged in, you should see your current auth token under the devspace-auth-token key. 

For protected endpoints, you will need to include your auth token in the authorization header of your HTTP request, preceded by "bearer". 

Example:
authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Devspace API Endpoints:

### insertUser (public)
#### Description:
Used to create the initial user account by submitting only the username, full name, and password.
#### HTTP Request Method:
POST
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/users
#### Required Headers:
content-type: application/json

### getUser (public)
#### Description:
Responds with requested user's full name, title, bio, profile picture, theme color, banner image, GitHub URL, LinkedIn URL, and email address.
#### HTTP Request Method:
GET
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/users/:user_name
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/users/chucknorris

### updateUser (protected)
#### Description:
Used to update requested user's full name, title, bio, profile picture, theme color, banner image, GitHub URL, LinkedIn URL, and email address. 
#### HTTP Request Method:
PATCH
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/users/:user_name
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/users/chucknorris
#### Required Headers:
content-type: application/json
authorization: bearer <AUTH TOKEN>

### deleteUser (protected)
#### Description:
Used to delete requested user's account. 
#### HTTP Request Method:
DELETE
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/users/:user_name
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/users/chucknorris
#### Required Headers:
authorization: bearer <AUTH TOKEN>

### insertProject (protected)
#### Description:
Used to create a new project by submitting the project's name, description, skills, GitHub URL, demo URL, and image URL.
#### HTTP Request Method:
POST
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/projects
#### Required Headers:
content-type: application/json
authorization: bearer <AUTH TOKEN>

### getProject (public)
#### Description:
Responds with requested projects's id, name, description, skills, GitHub URL, demo URL, image URL, and user/owner id.  
#### HTTP Request Method:
GET
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/projects/:project_id
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/projects/2

### updateProject (protected)
#### Description:
Used to update requested projects's name, description, skills, GitHub URL, demo URL, and image URL.
#### HTTP Request Method:
PATCH
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/projects/:project_id
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/projects/2
#### Required Headers:
content-type: application/json
authorization: bearer <AUTH TOKEN>

### deleteProject (protected)
#### Description:
Used to delete requested project. 
#### HTTP Request Method:
DELETE
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/projects/:project_id
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/projects/2
#### Required Headers:
authorization: bearer <AUTH TOKEN>

### getPortfolioData (public)
#### Description:
Responds with requested user's portfolio data, including the user's id, username, full name, title, bio, profile picture, theme color, banner image, GitHub URL, LinkedIn URL, email address, and projects. 
#### HTTP Request Method:
GET
#### Endpoint URL:
https://secure-badlands-85742.herokuapp.com/api/portfolio/:user_name
#### Example URL:
https://secure-badlands-85742.herokuapp.com/api/portfolio/chucknorris