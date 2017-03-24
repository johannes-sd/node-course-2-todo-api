const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");


const todos = [
    {_id: new ObjectId, text: "first test todo"},
    {_id: new ObjectId, text: "second test todo"}
]
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

describe('GET /todos/:id', ()=>{
    console.log(`${todos[0]._id.toHexString()}`);   
    it('should return doc', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                console.log("res " + res.body.Todo);
                expect(res.body.todos.text).toBe(todos[0].text);
            }).end(done);
    });
});