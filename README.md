# Activebrain Server

This is the project for the server that handles the following responsibilities:
 - Webserver for static content like client code
 - Authenticates users
 - Gathers results from client side tests
 - Tracks user sessions


 This application is best deployed as a container using the docker compose.
 The server relies on redis to maintain the session data as it is short lived.


## Requires
 - docker
 - git

## Initial configuration
Skip this step if you are just upgrading an existing installation

Execute these commands to create the directories and dependencies:
```bash
mkdir -p /data/results
echo "username:password" > /data/accounts

sudo docker run -d --restart always --name redis redis
```

## Create User Accounts
To create user accounts that allow users to execute tests add them to the /data/accounts file.
Username and passwords are seperated by a ":". Each pair must reside on it's own line.

Example:
```
username:password
username2:password2
```

## Upgrade / Run Server

To run the full fledged server and client execute the commands below on the docker host:
```bash
cd /tmp
rm -rf active*
git clone https://github.com/phillipCouto/activebrain.git
git clone https://github.com/bbuchsbaum/active_brain.git
cp -R active_brain/* activebrain/web/

cd activebrain
sudo docker build -t phillipcouto/activebrain .
sudo docker rm -f activebrain
sudo docker run -d --restart always -p 80:80 --name activebrain --link redis:redis -p 443:443 -v /data:/data phillipcouto/activebrain ./app -http ":80" -accounts "/data/accounts" -results "/data/results"

# To run the server with HTTPS
# Move the private key into the /data folder and make sure the private key name
# and certificate name match the path defined in the command below.
sudo docker run -d --restart always -p 80:80 --name activebrain --link redis:redis -p 443:443 -v /data:/data phillipcouto/activebrain ./app -http ":80" -https ":443" -accounts "/data/accounts" -results "/data/results" -key "/data/private.key" -cert "/data/public.crt"
```
