const express = require('express');
const router = express.Router();
const Script = require('../models/Script');
const isLoggedIn = require('../middleware/auth');

router.post('/', isLoggedIn, async (req, res) => {
    const { name, content, scheduledOn } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        let existingScript = await Script.findOne({ name, userId });

        if (existingScript) {
            existingScript.lastUsedAt = Date.now();
            existingScript.usageCount += 1;
            await existingScript.save();
            return res.status(200).json(existingScript);
        } else {
            const newScript = new Script({ name, content, scheduledOn, userId });
            await newScript.save();
            return res.status(201).json(newScript);
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const scripts = await Script.find({ userId });
        res.json(scripts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const script = await Script.findById(req.params.id);
        if (!script) {
            return res.status(404).json({ error: 'Script not found.' });
        }
        res.status(200).json(script);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id', isLoggedIn, async (req, res) => {
    const { name, content, scheduledOn } = req.body;
    try {
        const existingScript = await Script.findById(req.params.id);

        if (!existingScript) {
            return res.status(404).json({ error: 'Script not found.' });
        }

        if (name && name !== existingScript.name) {
            existingScript.name = name;
            existingScript.usageCount = 1;
        }

        if (content) {
            existingScript.content = content;
        }

        if (scheduledOn) {
            existingScript.scheduledOn = scheduledOn;
        }

        await existingScript.save();
        res.status(200).json(existingScript);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id/completed', isLoggedIn, async (req, res) => {
    try {
        const scriptComplete = await Script.findById(req.params.id);
        if (!scriptComplete) {
            return res.status(404).json({ error: 'Script not found.' });
        }
        scriptComplete.completed = true;
        scriptComplete.completionDate = new Date();
        await scriptComplete.save();
        res.status(200).json('Task Completed.');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const script = await Script.findByIdAndDelete(req.params.id);
        if (!script) {
            return res.status(404).json({ error: 'Script not found.' });
        }
        res.status(200).json({ message: 'Script deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
