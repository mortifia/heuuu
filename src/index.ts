import express from 'express';

express()
    .get('/', (req, res) => { res.send('coucou gg') })
    .listen(3000, () => { console.log(`http://localhost:3000`) })