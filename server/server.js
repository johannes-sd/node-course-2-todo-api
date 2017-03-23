var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");
const {ObjectID} = require('mongodb');

var app = express();

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
        res.status(404).send({});
        }
    // findbyid
     //success
        // if todo - send back todos
        // if !todo - send back 404 with empty body
    Todo.findById(id).then((todo)=>{
    if (!todo) {
        return res.status(404).send({});
    }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send({});
    });

     //error (400) request not valid - send empty body
})


app.listen(3000, () =>{
    console.log("Startet på port 3000");
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