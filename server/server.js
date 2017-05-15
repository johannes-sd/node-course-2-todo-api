// @ts-check
require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");


var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos', (req, res) =>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;
    //valider id
    // if !valid respond with 404 og bruks send uten value (empty body)
    if (!ObjectID.isValid(id)){
        return res.status(404).send({});
        }
    // findbyid
     //success
        // if todo - send back todos
        // if !todo - send back 404 with empty body
    Todo.findById(id).then((todo)=>{
    if (!todo) {
        return res.status(404).send({});
    }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send({});
    });

     //error (400) request not valid - send empty body
});

app.delete('/todos/:id', (req, res) => {
    // get id
    var id = req.params.id;
    //valider id¨
    if(!ObjectID.isValid(id)){
        return res.status(404).send({});
    }
    // fjern todo by id
        //success
            //if no doc send 404
            // if doc, send doc back with a 200
        //error
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({});
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send({});
    });


});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
        if(!ObjectID.isValid(id)){
        return res.status(404).send({});
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo : todo});
    }).catch((e) => {
        res.status(400).send();
    });

});


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);
    user.save().then(() =>{
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});




app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// nokeEnTest@testfirma.no

//POST /user
// app.post('/user', (req, res) => {
//         var user = new User({
//         email: req.body.email,
//         password: req.body.password
//     });
//     user.save().then((doc)=>{
//         res.send(doc);
//     },(e)=>{
//         res.status(400).send(e);
//     });
// });





app.listen(port, () =>{
    console.log("Startet på port " + port);
});

module.exports = {app};

 
//basic CRUD operations (create, read, update and delete)

// var anotherTodo = new Todo({
//     text: 'ta toget',
//     completed: false,
//     completedAt: 12345
// });

// anotherTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e)=>{
//     console.log("Unable to save object todo");
// });


// var enUser = new User({
//     email: "test"
// });
// enUser.save().then((doc)=>{
//     console.log(JSON.stringify(doc, undefined, 2))
// }, (e)=>{
//     console.log("Fikk ikke lagret brukeren", e);
// });