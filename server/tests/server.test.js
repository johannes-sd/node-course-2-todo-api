
const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");



// testing lifesycle method
beforeEach(populateUsers);
beforeEach(populateTodos);
//$debug;
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
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        //grab id from first item
        var firstID = todos[0]._id.toHexString();
        var text = "This should be the new text";
        request(app)
        .patch('/todos/' + firstID)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
            })
        .end(done)
        }); //STOP it('should update the todo', (done) => {
    }); //STOP describe('PATCH \todos\:id', () => {
    it('should clear completetAt when todo is not completed', (done) => {
        var secondID = todos[1]._id.toHexString();
        var text = 'Second documents text is hopefully now something different'
        //update text to something different, set completed to false
        request(app)
        .patch('/todos/' + secondID)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.completedAt).toNotExist()
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
        })
        .end(done)
    
        //assertions:
        // 200
        // text is changed, completed = false, completedAt is null .toNotExist
    });

describe('GET users/me', () => {
    it('should return a user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        }).end(done);
    });
    it('should return a 401 if not authenticated', (done) => {
        // expect 401 and body = empty object
        request(app)
        .get('/users/me')
        //.set('x-auth', users[1].tokens[0].token)
        .expect(401)
        .expect((res) => {
            //expect(res.body._id).toBe(users[1]._id.toHexString());
            expect(res.body) == {};
        }).end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'enEpost@testing.no';
        var password = "123mngL";

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });
    it('should return validation errors if request invalid', (done) => {
        var email = "ikkeEnEpost";
        var password = "12";
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect((res) => {
            expect((res.body)) == {};
        }).end(done);
    }); 
    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = users[0].password
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .expect((res) => {
            expect(res.body) == {};
        }).end(done);
    });
});
