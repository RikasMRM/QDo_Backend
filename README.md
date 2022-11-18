# QDo_Backend

Backend Source code of `QDo` ToDo list Web Application. 

QDo is a web application to manage todo lists with different status(Todo, In Progress and Done)


## Modify something

Required: NodeJS, NPM

Clone the repository and install the dependencies with NPM.

```bash
git clone https://github.com/RikasMRM/QDo_Backend.git
npm install
```

Running in development: 

```bash
## Windows 
npm start
```

Modify source code in the `src/` folder.

## Project structure

```
.
├── controllers              # HTTP Response
├── dbconfig                 
├── middleware                
├── model                    # Read/Write data
├── routes                   # HTTP Request (GET, POST, PUT, DELETE, etc.)
├── uploads                
├── utils               
└── server.js
```
## Environment Variables

The environment variables can be found and modified in the `.env` file.

MONGO_URI = 
PORT = 
NODE_ENV =
JWT_SECRET =
