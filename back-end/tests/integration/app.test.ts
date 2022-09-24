import supertest from "supertest";
import app from "../../src/app";
import { deleteAllData } from "./factories/scenarioFactory";
import recommendationFactory from "./factories/recommendationFactory";
import { prisma } from "../../src/database";

const server = supertest(app);

beforeEach(async () => {
    await deleteAllData();
})


describe('Tests with recommendations', ()=>{
    it('tests with POST /recommendations, creates a recommendation with sucess',async () => {
        const newRecommendation = recommendationFactory();

        const result = await server.post('/recommendations').send(newRecommendation);

        const createdRecommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });

        expect(result.status).toBe(201);
        expect(createdRecommendation).not.toBeNull();

    });
    it.todo('tests with POST /recommendations, try to create a recommendation that already exist, return conflict code');
    
    it.todo('tests with POST /recommendations/:id/upvote, creates a upvote to that recommendation with sucess');
    it.todo('tests with POST /recommendations/:id/upvote, try to creates a upvote to an inexistent recommendation ');

    it.todo('tests with POST /recommendations/:id/downvote, creates a downvote to that recommendation with sucess');
    it.todo('tests with POST /recommendations/:id/downvote, try to creates a downvote to an inexistent recommendation ');

    it.todo('tests with GET /recommendations, return a list of all recommendations on the db');

    it.todo('tests with GET /recommendations/:id, return a recommendation on the db');
    it.todo('tests with GET /recommendations/:id, try to return an inexistent recommendation');



    it.todo('tests with GET /random, return a random recommendation ');
    it.todo('tests with GET /random, try to return an inexistent random recommendation');


    it.todo('tests with GET /top/:amount, return a list of the top (amount) of recommendations');
})
