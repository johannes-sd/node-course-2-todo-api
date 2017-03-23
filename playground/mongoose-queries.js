const {ObjectID} = require('mongodb');

const {mogoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

var id = '58cf5aa8ef8e97141f608209';

// if (!ObjectID.isValid(id)){
//     console.log("Id not valid");
// }
// Todo.find({
//     _id: id
//     }).then((todos)=>{
//         console.log("todos", todos);
//     });

// Todo.findOne({
//     _id: id
//     }).then((todo)=>{
//         console.log("todos", todo);
//     });

// Todo.findById(id).then((todo)=>{
//     if (!todo) {
//         return console.log("ID not found.");
//     }
//         console.log("todos", todo);
//     }).catch((e) => {
//         console.log(e);
//     });

User.findById(id).then((user)=>{
    if (!user) {
        return console.log("User not found.");
    }
    console.log("User: ", user);
}).catch((e)=>{
    console.log(e);
});