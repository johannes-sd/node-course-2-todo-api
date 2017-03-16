//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server');
    }
    console.log('Tilkoblet til databasen');

    // db.collection('Todos').deleteMany({tekst:"spis lunsj"}).then((result) => {
    //     console.log(result);
    // });
    //deleteMany
    //deleteOne
    // db.collection('Todos').deleteOne({tekst:"spis lunsj"}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // });
    db.collection('Users').findOneAndDelete({_id: new ObjectID("58c8cf21c26c7706ac2e462e")}).then((result)=>{
        console.log(JSON.stringify(result, undefined, 2));
    });
    //db.close();
 });