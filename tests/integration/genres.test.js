const request = require('supertest');
const { Genre } = require('../../models/genreModel'); // genres model
const { User } = require('../../models/userModel'); // user model
const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server; // defines a server

    // starts the server before all the tests
    beforeAll(async () => { server = require('../../app'); });
    // cleans the DB after each test
    afterEach(async () => { await Genre.deleteMany({}); }); 
    // closes the server after all the tests
    afterAll(async () => { await server.close(); })

    describe('GET /', () => {
        it('should return all genres', async () => {
            // method to add multiple documents to our DB
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200); // check if response was a success
            expect(res.body.length).toBe(2); // check if length of document is 2
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({ genre: "genre1" }); // create new genre
            await genre.save(); // save genre to DB

            const res = await request(server).get('/api/genres/' + genre._id); // make request to DB to get genre using ID
            expect(res.status).toBe(200); // expect successful response
            expect(res.body).toHaveProperty('genre', genre.genre); // expect genre object
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1'); // make a faulty request to DB
            expect(res.status).toBe(404); // expect a fail response
        });
        
        it('should return 404 if no genre with the given id exist', async () => {
            const id = new mongoose.Types.ObjectId(); // generates a valid id
            const res = await request(server).get('/api/genres/' + id); // makes a request with id
            expect(res.status).toBe(404); // expect a fail response
        });
    });

    describe('POST /', () => {
        // writing clean code
        let token;
        let genre;

        // function for logging in users and posting genres
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genre: genre }); 
        };

        // this will set these values before each test runs
        beforeEach( () => {
            token = new User().generateAuthToken(); // generate a valid token for user to login with
            genre = 'genre1'; // set genre to 'genre1'
        });

        it('should return 401 if client is not logged in', async () => {
            token = ''; // set invalid token

            const res = await exec(); // login with invalid token

            expect(res.status).toBe(401); // test
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            genre = '1234'; // set invalid genre
            
            const res = await exec(); // login and post genre

            expect(res.status).toBe(400); // test
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            const name = new Array(52).join('a'); // generates 51 'a' characters

            genre = name; // set genre to the 51 'a' characters

            const res = await exec(); // login and post genre

            expect(res.status).toBe(400); // test
        });

        // HAPPY PATH
        
        it('should save the genre in DB if it is valid', async () => {
            await exec(); // login and post genre

            const getGenre = await Genre.find({ genre: 'genre1' }); // find genre

            expect(getGenre).not.toBeNull(); // test
        });
        
        it('should return the genre if it is valid', async () => {
            const res = await exec(); // login and post genre

            expect(res.body).toHaveProperty('_id'); 
            expect(res.body).toHaveProperty('genre', 'genre1'); 
        });
    });
});