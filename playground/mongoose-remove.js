const {ObjectID} = require('mongodb');

const {mogoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

// Todo.remove({}).then((res) => {
//     console.log(res);
// });

Todo.findByIdAndRemove('58d9eab8fe1889cf3bb4e124').then((todo) => {
    console.log(todo);
});