var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completetAt: {
        type: Number
    }
});

var anotherTodo = new Todo({
    {text: 'ta toget'},
 {completet: false},
 {completedAt: 000000}
});

anotherTodo.save().then((doc)=>{
    console.log("saved todo", doc);
}, (e)=>{
    console.log("Unable to save object todo");
});