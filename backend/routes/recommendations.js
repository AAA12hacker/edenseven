const express = require('express');
const router = express.Router();
const Script = require('../models/Script');
const isLoggedIn = require('../middleware/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.userId;
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); 

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const recommendedScripts = await Script.find({
            userId,
            usageCount: { $gte: 3 }, 
            lastUsedAt: { $gte: fiveDaysAgo } 
        });

        res.json(recommendedScripts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id', isLoggedIn, async (req, res) => {
    const { name, content } = req.body;
    const userId = req.userId;
    const scriptId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        let existingRecommendation = await Script.findOne({ scriptId, userId });

        if (existingRecommendation) {
            existingRecommendation.lastUsedAt = Date.now();
            existingRecommendation.usageCount += 1;
            await existingRecommendation.save();
            return res.status(200).json(existingRecommendation);
        } else {
            const newRecommendation = new Script({ name, content, userId, scriptId });
            await newRecommendation.save();
            return res.status(201).json(newRecommendation);
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


module.exports = router;
