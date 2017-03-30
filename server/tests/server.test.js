const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");


const todos = [
    {   _id: new ObjectId(), 
        text: "first test todo"},
    {   _id: new ObjectId(), 
        text: "second test todo"}
];
// testing lifesycle method
beforeEach((done) =>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos); 
    }).then(() => done());
});

describe('POST /todos', ()=>{
    it("should create a new todo", (done)=>{
        var text = 'testetodotekst';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) =>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    
    });
    it('should not create todos with invalid body data', (done) => {
       request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) =>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
 
    });
});
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    console.log('/todos/' + `${todos[0]._id.toHexString()}`);   
    it('should return doc', (done) => {
        request(app)
            .get('/todos/' + `${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                //console.log("res " + JSON.stringify(res.body.todo, undefined, 2));
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });
    it('should return a 404 if todo not found.', (done) => {
        var fakeID = new ObjectId();
        request(app)
        .get('/todos/' + fakeID)
        .expect(404)
        .end(done);
    });
    it('should return a 404 if ID is not valid', (done) => {
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
            .delete('/todos/' + hexID)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexID);
                })
                .end((err, res) => {    
                    if(err){
                        return done(err);
                    }
                    Todo.findById(hexID).then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    }).catch((e) => done(e));
                    // query database using findById toNotExist
                    // expect(null).toNotExist()
                });
    });
    it('should return a 404 if todo not found', (done) =>{
        var fakeID = new ObjectId().toHexString();
        request(app)
        .delete('/todos/' + fakeID)
        .expect(404)
        .end(done);
    });
    it('should return a 404 if ObjectId is invalid', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
});

