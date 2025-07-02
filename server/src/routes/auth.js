const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-helper-secret';

router.post('/login', async (req, res) => {
    const {userId} = req.body;

    if (!userId) {
        return res.status(400).json({error: 'userId is required'});
    }

    const token = jwt.sign({id: userId}, JWT_SECRET, {expiresIn: '7d'});
    res.json({token});
});

module.exports = router;