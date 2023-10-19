import http = require('http');
import { writeIntoBlockchain, retrieveJsonFromBlockchain } from './services/blockchain-service';

const myServer = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/write') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', async () => {
            try {
                const jsonObject = JSON.parse(data);
                const identifier = await writeIntoBlockchain(jsonObject);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ identifier }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error writing to blockchain' }));
            }
        });
    } else if (req.method === 'GET' && req.url?.startsWith('/retrieve/')) {
        const identifier = req.url.slice('/retrieve/'.length);
        try {
            retrieveJsonFromBlockchain(identifier)
                .then((jsonData) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(jsonData));
                })
                .catch((err) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error reading from blockchain' }));
                });
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid identifier' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

export default myServer;