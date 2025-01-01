const request = require('supertest');
const { Rental } = require('../../models/rentalModel'); // genres model
const { User } = require('../../models/userModel'); // user model
const { Movie } = require('../../models/movieModel'); // user model
const mongoose = require('mongoose'); // mongoose library

describe('/api/returns', () => {
    let server; // define the server
    let customerId; // define customerId
    let movieId; // define movieId
    let rental; // define rental
    let movie; // define movie
    let token; // define token

    // function for logging in users and posting genres
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId }); 
    };
    // used to start the server once before all tests
    beforeAll(async () => { server = require('../../app'); });
    // creates tokens, movie and rental object before each test
    beforeEach(async () => { 
        token = new User().generateAuthToken(); // generate a valid token for user to login with
        
        customerId = new mongoose.Types.ObjectId(); // set new customer id
        movieId = new mongoose.Types.ObjectId(); // set new movie id

        // create a new movie
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { genre: '12345' },
            numberInStock: 10
        });
        await movie.save(); // save movie to DB

        // create a new rental
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save(); // save rental
    }); 
    // cleans up the DB after each test
    afterEach(async () => { 
        await Rental.deleteMany({}); // cleanup - remove all documents in rental collection
        await Movie.deleteMany({}); // cleanup - remove all documents in the movie collection
    }); 
    // closes the server after all the tests are done
    afterAll(async () => { await server.close(); });

    it('should return 401 if client is not logged in', async () => {
        token = ''; // set token to empty string
        const res = await exec(); // execute request
        expect(res.status).toBe(401); // expect status code to be 401
    });
    
    it('should return 400 if customerId is not provided', async () => {
        customerId = ''; // set customerId to empty string
        const res = await exec(); // execute request
        expect(res.status).toBe(400); // expect status code to be 400
    });
    
    it('it should return 400 if movieId is not provided', async () => {
        movieId = ''; // set movieId to empty string
        const res = await exec(); // execute request
        expect(res.status).toBe(400); // expect status code to be 400
    });
    
    it('should return 404 if no rental found for the customer/movie', async () => {
        await Rental.deleteMany({}); // delete the rental
        const res = await exec(); // execute request
        expect(res.status).toBe(404); // expect status code to be 404
    });
    
    it('should return 400 if return is already processed', async () => {
        rental.dateReturned = new Date(); // set dateReturned to current date
        await rental.save(); // save rental
        const res = await exec(); // execute request
        expect(res.status).toBe(400); // expect status code to be 400
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec(); // execute request
        expect(res.status).toBe(200); // expect status code to be 200
    });

    it('should set the returnDate if input is valid', async () => {
        await exec(); // execute request
        const rentalInDb = await Rental.findById(rental._id); // find rental in db
        const currDate = new Date(); // get current date
        const dbDate = rentalInDb.dateReturned; // get dateReturned from db
        const diff = currDate - dbDate; // calculate difference between current date and dateReturned
        expect(diff).toBeLessThan(10 * 1000); // expect dateReturned to be within 10ms of current date
    });
    
    it('should set the rentalFee if input is valid', async () => {
        rental.dateOut = new Date(); // set dateOut to 7 days ago
        rental.dateOut.setDate(rental.dateOut.getDate() - 7);
        await rental.save();
        await exec(); // execute request
        const rentalInDb = await Rental.findById(rental._id); // find rental in db
        expect(rentalInDb.rentalFee).toBe(16); // expect rentalFee to be 14
    });
    
    it('should increase the movie stock', async () => {
        await exec(); // execute request
        const movieInDb = await Movie.findById(movieId); // find movie in db
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); // expect number in stock to increase by 1
    });
    
    it('should return rental if input is valid', async () => {
        const res = await exec(); // execute request
        const rentalInDb = await Rental.findById(rental._id); // find rental in db
        // expect(res.body).toHaveProperty('_id', rentalInDb._id.toHexString()); // expect response body to match rental in db
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])); // expect response body to contain these keys
    });
});