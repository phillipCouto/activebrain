# Activebrain Server

This is the project for the server that handles the following responsibilities:
 - Webserver for static content like client code
 - Authenticates users
 - Gathers results from client side tests
 - Tracks user sessions


 This application is best deployed as a container using the docker compose.
 The server relies on redis to maintain the session data as it is short lived.
 