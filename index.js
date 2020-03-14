// implement your API here
const db = require("./data/db.js");

const express = require('express');
//banana variable name, require keyword, the string is the path to the module(s)? In this case, it takes in string of express because express is the module

const server = express();
//set up a server object via express function- no parameters needed

server.listen(4000, () => {
//on the server object, keyword listen method. Requires 2 parameters
//1. a TCP- port number (Transmission Control Protocol) Routes things around the internet- 
//2. a Callback (function that gets called once the server successfully begins listening)
    console.log('it\'s working');
});

server.use(express.json());

server.get('/', (request, response) => {
//server object, get method, takes 2 values- says when the request matches this path, do this callback
//1. path that comes after server name in the port #
//2. callback
//the callback takes two parameters
//req or request param obj that contains all the information about the request (headers, parameters, parameterized values)
//res or response object tht contains data that the server will use to send back to the requester
//THE HOMIES, always go together
response.send("test string from send");
//on the response object, there's a method called send allows to send back a string
});


//TEST SEND TO PATH
server.get("/hey", (req, res) => {
    res.send("Second Test from path /hey");
})



//GET USERS
server.get("/api/users", (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json({users})
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The users information could not be retrieved", err })
    })
})




//GET BY UID
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            console.log(user)
            if (user => user.id === id) {
                res.status(200).json(user);  
            } else {
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be retrieved", err })
        })
})



//POST
server.post("/api/users", (req, res) => {
    const user = req.body;
    console.log(user)

    db.insert(user)
    .then(param => {
        if (user.name && user.bio) {
            res.status(201).json({success: true, param})
        } else {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user" })
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the db", err});
    });
})

//DELETE
server.delete("/api/users/:id", (req, res) => {
    const {id} = req.params;

    db.remove(id)
    .then(id => {
        if (user => user.id === id) {
            res.status(201).json({ message: `User deleted` });
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist"});
        }
    })
    .catch(() => {
        res.status(500).json({ errorMessage: "The user could not be removed"});
    })
})

//PATCH/PUT
server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    // console.log(user)

    db.update(id, updatedUser)
    .then(user => {
        if (user) {
            if (updatedUser.name && updatedUser.bio) {
                res.status(204).json({ user });
            } else {
                res.status(400).json({
                    errorMessage: 'Please provide name and bio for the user.'
                });
            }
        } else {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.'
            });
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The user info could not be modified", err });
    })
})
