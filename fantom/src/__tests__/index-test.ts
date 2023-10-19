import * as http from 'http';
import supertest from 'supertest';
import myServer from '../server';

describe('Server Endpoints', () => {
    let server: http.Server;
    let request: supertest.SuperTest<supertest.Test>;

    beforeAll(() => {
        server = myServer.listen(3000); // Start the server for testing
        request = supertest(server);
    });

    afterAll((done) => {
        server.close(done); // Close the server after testing
    });

    it('POST /write should add data to blockchain', async () => {
        const dataToSend = {
            "secret_message": {
                "checksum": "WSKz5fc2SB4mtujMcgAzJw==",
                "header": "RGVmYXVsdEhlYWRlcg==",
                "iv": "q9ESSvM16alKyIsi4axE7nM2rxNsgPFDXPx8ATVhUFM=",
                "text": "amOxcsRK5j/QNSN71Q=="
            }
        };

        const response = await request
            .post('/write')
            .send(dataToSend)
            .expect(200)
            .expect('Content-Type', /json/);

        // Your assertions based on the response data
        expect(response.body).toHaveProperty('identifier');
    }, 30000);

    it('GET /retrieve/:identifier should retrieve data from blockchain', async () => {
        const identifier = 'PROVA'; // Replace with a valid identifier

        const response = await request
            .get(`/retrieve/${identifier}`)
            .expect(200)
            .expect('Content-Type', /json/);

        // Your assertions based on the response data
        expect(response.body).toHaveProperty("secret_message");
    });

    it('GET /retrieve/:invalidIdentifier should handle invalid identifier', async () => {
        const invalidIdentifier = 'invalidIdentifier';

        const response = await request
            .get(`/retrieve/${invalidIdentifier}`)
            .expect(500)
            .expect('Content-Type', /json/);

    });
});
