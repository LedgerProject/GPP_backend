import myServer from './server';

myServer.listen(3000, () => {
    console.log('Server is running on port 3000. Go to http://localhost:3000/')
});