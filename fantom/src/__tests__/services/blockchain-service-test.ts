import { writeIntoBlockchain, retrieveJsonFromBlockchain } from '../../services/blockchain-service'; // Replace with the actual path to your module
const dotenv = require('dotenv');
dotenv.config();

const stringToUpload = {
    "secret_message": {
        "checksum": "WSKz5fc2SB4mtujMcgAzJw==",
        "header": "RGVmYXVsdEhlYWRlcg==",
        "iv": "q9ESSvM16alKyIsi4axE7nM2rxNsgPFDXPx8ATVhUFM=",
        "text": "amOxcsRK5j/QNSN71Q=="
    }
};

describe('Write for real in blockchain', () => {
    it('should write on blockchain', async () => {
        // Upload the string to IPFS
        const resultingIdentifier = await writeIntoBlockchain(stringToUpload);
        expect(resultingIdentifier).not.toBe(null);
    }, 60000);
});

describe('Read for real in blockchain', () => {
    it('should read on blockchain', async () => {

        const identifier = '84612795-73f9-4d38-ba1b-3de6540c897c';

        // Upload the string to IPFS
        const resultingJson = await retrieveJsonFromBlockchain(identifier);
        expect(resultingJson).toEqual(stringToUpload);
    });
});