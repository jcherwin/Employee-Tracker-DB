# Employee-Tracker

## Description

The purpose of this program is to provide both a front-end application that allows users to easily view, update, and remove company records and a back-end server for transmitting and storing those records within a personalized database.

This program utilizes node.js as well as the npm packages 'express' for handling server routing, 'mysql2' for communicating with the database, 'axios' for communicating from the front-end app to the back-end server, 'console.table' to print the data response from the database in the terminal, and 'inquirer' for prompting users for information in the front-end and navigating the program itself.

## Installation

This program was built and tested using node.js v16.19.0.

After cloning this repository into a working folder of your own, you'll need to run the following command to pull in the node packages required to run the program.

```md
npm install OR npm i
```

## Usage

Before running the server, you should navigate to the 'db' folder, setup the schema, and also seed the database in order to have data to display and manipulate by running the following commands after logging in through the SQL Client:

```md
source schema.sql
source seeds.sql
```

After installation and setting up the database, you can run the server by typing:

```md
node server.js
```

This will bring up a message:

```md
Connected to the company_db database
Server running on port 3001
```

Finally, you can run the main program by running the following command in the root directory:

```md
node index.js
```
<br>
Here is an external link to the following video (https://drive.google.com/file/d/1mZqUVVOrCrx_K51o1LSOMN6gB5FARAZv/view)[https://drive.google.com/file/d/1mZqUVVOrCrx_K51o1LSOMN6gB5FARAZv/view]
<br>
Here is a video demonstrating how the program should run:
https://user-images.githubusercontent.com/117125528/221761274-1ba966a4-f3f0-44a3-a6de-17bd624af984.mp4
