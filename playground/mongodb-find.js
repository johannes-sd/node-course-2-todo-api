//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Tilkoblet til databasen');

/*    db.collection('Todos').find({completed:false}).toArray().then((docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) =>{
        console.log("Fant ikke data", err);
    });*/

    db.collection('Todos').find().count().then((count) => {
        console.log("Antall Todos " + count);
    }, (err) =>{
        console.log("Fant ikke data", err);
    });

    //db.close();
 });