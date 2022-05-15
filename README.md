# WORDIFY

Designed and developed a publication based full stack web application that serves user top articles and authenticated users can publish their own articles
and perform CRUD operations. Developed front end using EJS view engine snippets, DB operations are
performed on mongoDB Atlas cluster and data validated using mongoose. Implemented authentication and session cookies using passport.js

# Features

1. User lands on the sign up page where user can sign up or toggle to login if already an user. 
2. Navigation menu and header's visibility is hidden for unauthorized request.
3. Authentication is performed using Passport.js and its passport-local module.
4. On Authorised request user is redirected to the home page and nav bar is available.
5. On home page user is welcomed using his/her user name and all the articles are listed for reading.
6. User can land on particular post page using read more link.
7. Only read permission is allowed on posts written by other users.
8. User can read all posts, edit and delete self composed posts which user can find under my articles page.
9. On Logout user request is marked unauthorised and redirected to the sign up landing page.

# Tech

1. Backend: node.js and express
2. Frontend: HTML5, CSS3, JavaScript, EJS
3. Database: mongoDB
4. ODM: Mongoose
5. Authentication: Passport.js, passport-local
6. Session cookies: express-session
   
![alt text](https://github.com/yuvirajawat/Wordify/blob/main/logo.png?raw=true)
