//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Tilkoblet til databasen');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("58ca2c1059288a68a6490dd7")
    // },{
    //     $set: {
    //         completet: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("58c787ac6702d126e0aa5c7b")
    },{
        $set: {
            navn: "jmj"
        },
        $inc: {
            alder: 1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });

// CRUD create, read, update and delete


    //db.close();
 });