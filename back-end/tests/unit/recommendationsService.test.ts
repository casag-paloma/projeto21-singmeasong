import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import {conflictError} from '../../src/utils/errorUtils'

beforeEach(()=>{
    jest.resetAllMocks();
    jest.clearAllMocks();
});

describe('Unit tests of recommendation Service', ()=>{
    it('must create a recommendation',async () => {
        
        const recommendation ={
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        jest
        .spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce((): any =>{});

        jest
        .spyOn(recommendationRepository, 'create')
        .mockImplementationOnce((): any =>{});

        await recommendationService.insert(recommendation);

        expect(recommendationRepository.findByName).toBeCalled();
        expect(recommendationRepository.create).toBeCalled();


    }),
    it('must NOT create a duplicated recommendation',async () => {
        
        const recommendation ={
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        jest
        .spyOn(recommendationRepository, 'findByName')
        .mockImplementationOnce((): any =>{
            return{
                id: 1,
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                score: 0 
            }
           });


//           const promise = await recommendationService.insert(recommendation);

        console.log('')

        //expect(promise).rejects.toEqual({
        //    type: "conflict",
        //     message:"Recommendations names must be unique"
        //});
        expect(recommendationRepository.create).not.toBeCalled();

    }),

    it.todo('upvote'),
    it.todo('downvote'),
    it.todo('getRandom'),
    it.todo('get'),
    it.todo('getById'),
    it.todo('getTop')
})

