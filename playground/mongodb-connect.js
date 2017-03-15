//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Tilkoblet til databasen');

   /* db.collection('Todos').insertOne({
        tekst: "noe", 
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log("Fikk ikke lagret en Todo", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));

    });*/

/*     db.collection('Users').insertOne({
        navn: "noe", 
        alder: 40,
        lokasjon: "toget"
    }, (err, result) => {
        if (err) {
            return console.log("Fikk ikke lagret en User", err);
        }
        console.log(result.ops[0]._id.getTimestamp());

    });*/

    db.close();
 });