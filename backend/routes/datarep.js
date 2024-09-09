const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Script = require('../models/Script');
const isLoggedIn = require('../middleware/auth');


router.get('/:userId',isLoggedIn, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const scripts = await Script.find({ userId: req.params.userId });

        const loginTimestamps = user.loginTimestamps || []; // Provide a default value if loginTimestamps is undefined
        const taskCompletionTimestamps = scripts
            .filter(script => script.completed)
            .map(script => script.completionDate);

        const stats = {
            loginTimestamps,
            taskCompletionTimestamps,
            scripts
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching user or scripts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
