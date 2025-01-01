const request = require('supertest');
const { Genre } = require('../../models/genreModel'); // genres model
const { User } = require('../../models/userModel'); // user model

describe('auth middleware', () => {
    let server; // defines a server

    // starts the server before all tests
    beforeAll(async () => { server = require('../../app'); });
    // generates a token before each test
    beforeEach(() => { token = new User().generateAuthToken(); });
    // cleans the DB after each test
    afterEach(async () => { await Genre.deleteMany({}); });
    // closes the server after all the tests
    afterAll(async () => { await server.close(); });

    let token;
    // function for logging in users and posting genres
    const exec = () => {
        return request(server)
            .post('/api/genres') // pick an endpoint to use
            .set('x-auth-token', token) // set token
            .send({ genre: 'genre1'});  // add data
    };

    it('should return 401 if no token is provided', async () => {
        token = ''; // set no token
        const res = await exec(); // login with token and post genre
        expect(res.status).toBe(401); // test
    });
    
    it('should return 400 if token is invalid', async () => {
        token = 'a'; // set invalid token
        const res = await exec(); // login with invalid token and post genre
        expect(res.status).toBe(400); // test
    });
    
    it('should return 200 if token is valid', async () => {
        const res = await exec(); // login - valid token already set at beforeEach
        expect(res.status).toBe(200); // test
    });
});