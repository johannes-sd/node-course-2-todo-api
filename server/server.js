var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

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

app.listen(3000, () =>{
    console.log("Startet på port 3000");
});


 
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