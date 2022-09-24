import supertest from "supertest";
import app from "../../src/app";

const server = supertest(app);

describe('Tests with recommendations', ()=>{
    it.todo('tests with POST /, creates a recommendation with sucess');
    it.todo('tests with POST /, try to create a recommendation that already exist, return conflict code');
    
    it.todo('tests with POST /:id/upvote, creates a upvote to that recommendation with sucess');
    it.todo('tests with POST /:id/upvote, try to creates a upvote to a recommendation that dont exist on the db, return not found code ');

    it.todo('tests with POST /:id/downvote, creates a downvote to that recommendation with sucess');
    it.todo('tests with POST /:id/upvote, try to creates a downvote to a recommendation that dont exist on the db, return not found code ');

    it.todo('tests with GET /, return a list of all recommendations on the db');

    it.todo('tests with GET /random, return a random recommendation ');
    it.todo('tests with GET /top/:amount');
})
