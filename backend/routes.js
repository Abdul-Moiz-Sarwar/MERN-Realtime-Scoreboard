const express = require('express')
const router = express()
const Team = require('./models')

router.get('/get', (req, res) => { 
    try{
        Team.find()
        .then((data) => {res.send(data);})
        .catch((err) => {console.log(err);})
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router