const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require("jsonwebtoken");

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
    _id: userOneId,
    email: 'undersjef@eksempel.no',
    password: 'bruker1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
    },
    {
    _id: userTwoId,
    email: 'oversjef@eksempel.no',
    password: 'bruker2pass'

}];

const todos = [
    {   _id: new ObjectId(), 
        text: "first test todo"},
    {   _id: new ObjectId(), 
        text: "second test todo",
        completed: true,
        completedAt: 665
    }
];

const populateTodos = (done) =>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos); 
    }).then(() => done());
};  

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all ([userOne, userTwo]);
    }).then(() => {
           done(); 
        });
};

module.exports = {todos, populateTodos, users, populateUsers};