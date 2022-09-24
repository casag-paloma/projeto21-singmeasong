import { jest } from '@jest/globals';
import { Recommendation } from '@prisma/client';

import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';
import {conflictError, notFoundError} from '../../src/utils/errorUtils'

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
    it('must NOT create a duplicated recommendation', async () => {
        const recommendation ={
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }
    
        jest
          .spyOn(recommendationRepository, 'findByName')
          .mockImplementationOnce((): any => {
            return {
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            };
          });
    
        const promise = recommendationService.insert(recommendation);
    
        expect(promise).rejects.toEqual({
          type: 'conflict',
          message: 'Recommendations names must be unique'
        });
    
        expect(recommendationRepository.create).not.toBeCalled();
      });
    
    
    it('must upvote a recommendation',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any =>{
            return{
                id:1
            };
        });
        
        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce(():any =>{});

        await recommendationService.upvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    } ),
    it('must NOT upvote a recommendation, if the recommendation does not exist',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any =>{});
        
        const promise = recommendationService.upvote(id);

        expect(promise).rejects.toEqual( {type: "not_found", message: "" });
      
        expect(recommendationRepository.updateScore).not.toBeCalled();
        
      
    } ),
   

    it('must downvote a recommendation, with a score > -5',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any =>{
            return{
                id:1
            };
        });
        
        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce(():any =>{
            return{
                score:0
            }
        });

        jest
        .spyOn(recommendationRepository, 'remove')
        .mockImplementationOnce(():any =>{});

        await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();

    } ),
    it('must downvote a recommendation, with a score <= -5',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any =>{
            return{
                id:1
            };
        });
        
        jest
        .spyOn(recommendationRepository, 'updateScore')
        .mockImplementationOnce(():any =>{
            return{
                score:-6
            }
        });

        jest
        .spyOn(recommendationRepository, 'remove')
        .mockImplementationOnce(():any =>{ });
        
        await recommendationService.downvote(id);

        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    } ),
    it('must NOT downvote a recommendation, if the recommendation does not exist',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any =>{});
        
        const promise = recommendationService.upvote(id);

        expect(promise).rejects.toEqual( {type: "not_found", message: "" });
      
        expect(recommendationRepository.updateScore).not.toBeCalled();
        
      
    } ),
   

    it('must get recommendations',async () => {
        
        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce(():any=>{})

        await recommendationService.get();

        expect(recommendationRepository.findAll).toBeCalled();
    }),


    it('must get a recommendation by its id',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any=>{
            return{
                id:1
            }
        })

        await recommendationService.getById(id);

        expect(recommendationRepository.find).toBeCalled();
    }),
    it('must NOT get a recommendation by its id, if the recommendation does not exist',async () => {

        const id = 1;
        
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce(():any=>{ })

        const promise = recommendationService.getById(id);

        expect(promise).rejects.toEqual( {type: "not_found", message: "" });
    }),
    

    it('must get a random recommendation if there was select a +10 or -5 to 10 rate song and they exist on the database ',async () => {

        const recommendation = [{ 
            id: 1,
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
            score: 0 
        }]

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce(():any =>{
            return recommendation  })

        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalled();
    }),
    it('must get a random recommendation there was select a +10 or -5 to 10 rate song and they dont exist on the database ',async () => {

        const recommendation1 = []
        const recommendation = [{ 
            id: 1,
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
            score: 0 
        }]


        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce(():any =>{
            return recommendation1  })

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementationOnce(():any =>{
            return recommendation  })
    
        await recommendationService.getRandom();

        expect(recommendationRepository.findAll).toBeCalledTimes(2);
    }),
    it('must NOT get random recommendation, if the recommendation does not exist ',async () => {
        
        const recommendation = [];

        jest
        .spyOn(recommendationRepository, 'findAll')
        .mockImplementation(():any =>{
            return recommendation  
        })

        const promise = recommendationService.getRandom();

        expect(promise).rejects.toEqual( {type: "not_found", message: "" });

    }),


    it('must get top recommendations',async () => {

        const amount = 1;
        
        jest
        .spyOn(recommendationRepository, 'getAmountByScore')
        .mockImplementationOnce(():any => {})
        
        await recommendationService.getTop(amount);

        expect(recommendationRepository.getAmountByScore).toBeCalled();
    })
})

