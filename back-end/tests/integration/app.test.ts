import supertest from "supertest";
import app from "../../src/app";
import { deleteAllData, disconnectPrisma } from "./factories/scenarioFactory";
import recommendationFactory from "./factories/recommendationFactory";
import { prisma } from "../../src/database";
import { Recommendation } from "@prisma/client";
import { faker } from "@faker-js/faker";

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
    it('tests with POST /recommendations, try to create a recommendation that already exist, return conflict code',async () => {
        const newRecommendation = recommendationFactory();

        await server.post('/recommendations').send(newRecommendation);
        const result = await server.post('/recommendations').send(newRecommendation);

        expect(result.status).toBe(409);
        
    });
    

    it('tests with POST /recommendations/:id/upvote, creates a upvote to that recommendation with sucess',async () => {
        const newRecommendation = recommendationFactory();

        await server.post('/recommendations').send(newRecommendation);
        
        const createdRecommendation: Recommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });
        
        const id = createdRecommendation.id;
        const result = await server.post(`/recommendations/${+id}/upvote`);

        const uptadedRecommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });

        expect(result.status).toBe(200);
        expect(uptadedRecommendation.score).toEqual(createdRecommendation.score +1);


    });
    it('tests with POST /recommendations/:id/upvote, try to creates a upvote to an inexistent recommendation ',async () => {
        
        const id =  faker.finance.amount(0,1000,0);

        const result = await server.post(`/recommendations/${+id}/upvote`);

        const uptadedRecommendation = await prisma.recommendation.findFirst({
            where:{ id: +id }
        });

        expect(result.status).toBe(404);
        expect(uptadedRecommendation).toBeNull();

    });


    it('tests with POST /recommendations/:id/downvote, creates a downvote to that recommendation with sucess',async () => {
        const newRecommendation = recommendationFactory();

        await server.post('/recommendations').send(newRecommendation);
        
        const createdRecommendation: Recommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });
        
        const id = createdRecommendation.id;
        const result = await server.post(`/recommendations/${+id}/downvote`);

        const uptadedRecommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });

        expect(result.status).toBe(200);
        expect(uptadedRecommendation.score).toEqual(createdRecommendation.score -1);


    });
    it('tests with POST /recommendations/:id/downvote, try to creates a downvote to an inexistent recommendation ',async () => {
        
        const id =  faker.finance.amount(0,1000,0);

        const result = await server.post(`/recommendations/${+id}/downvote`);

        const uptadedRecommendation = await prisma.recommendation.findFirst({
            where:{ id: +id }
        });

        expect(result.status).toBe(404);
        expect(uptadedRecommendation).toBeNull();

    });


    it('tests with GET /recommendations, return a list of all recommendations on the db',async () => {
        
        const result = await server.get('/recommendations');

        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Array)
    });


    it('tests with GET /recommendations/:id, return a recommendation on the db',async () => {
        
        const newRecommendation = recommendationFactory();

        await server.post('/recommendations').send(newRecommendation);
        
        const createdRecommendation: Recommendation = await prisma.recommendation.findFirst({
            where:{ name: newRecommendation.name}
        });
        
        const id = createdRecommendation.id;
        const result = await server.get(`/recommendations/${+id}`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(createdRecommendation);
    });
    it('tests with GET /recommendations/:id, try to return an inexistent recommendation',async () => {
        
        const id =  faker.finance.amount(0,1000,0);

        const result = await server.get(`/recommendations/${+id}`);

        const uptadedRecommendation = await prisma.recommendation.findFirst({
            where:{ id: +id }
        });

        expect(result.status).toBe(404);
        expect(uptadedRecommendation).toBeNull();
    });


    it.todo('tests with GET /random, return a random recommendation ');
    it.todo('tests with GET /random, try to return an inexistent random recommendation');


    it('tests with GET /top/:amount, return a list of the top (amount) of recommendations',async () => {
        
        const amount =  faker.finance.amount(0,1000,0);

        const result = await server.get(`/recommendations/top/${+amount}`);

        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Array)
    });
})


afterAll(async () => {
    await disconnectPrisma();
})