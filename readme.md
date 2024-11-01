random text based chat:


users start out texting random people, then 
they can form groups with those people, or move on / quit

users will have a dashboard to view all groups and buttons to interact with them

users will be able to add other users to the groups they are in (may put a limit on people per group)

run these commands to run a build on a machine (given node and npm is installed, there is a valid dotenv, etc.)

npm install
npm run start

This is only a server instance running on local machine, the needed variables for the .env file are: 

MONGO_URL=<url for mongodb>
SESSION_SECRET=<secret for the session, can be any random string>
BASE_PATH=<http / https path>
HOST=<host of the machine (can be localhost or an ip)>
EMAIL_ADDR=<email addr for sending 2fa>
EMAIL_PASS=<password for email addr>
GOOGLE_APP_KEY=<key configured to your EMAIL_ADDR>
TEST_MONGODB_URL=<test url for testing the app>
MODE=<dev or prod, depending on what you choose>    

THE .env FILE IS MEANT FOR YOUR THE MACHINE RUNNING THE APP, NOT PUBLIC