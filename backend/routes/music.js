const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const initGFS = require('../config/gridFS');
const Music = require('../models/Music');
const isLoggedIn = require('../middleware/auth');

// Middleware to initialize GridFSBucket
let gfs;
const ensureGFSInitialized = async (req, res, next) => {
  if (!gfs) {
    try {
      gfs = await initGFS();
    } catch (err) {
      console.error('Failed to initialize GridFSBucket', err);
      return res.status(500).json({ error: 'Failed to initialize file storage' });
    }
  }
  next();
};

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload music
router.post('/', isLoggedIn, ensureGFSInitialized, upload.single('music'), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    const userId = req.userId; // Assuming authentication middleware sets req.userId

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploading file:', file.originalname, 'Size:', file.size, 'MIME Type:', file.mimetype);

    // Upload the file to GridFS
    const uploadStream = gfs.openUploadStream(file.originalname, {
      contentType: file.mimetype
    });

    // Handle errors during upload
    uploadStream.on('error', (err) => {
      console.error('Error during file upload:', err);
      return res.status(500).json({ error: 'Error uploading file', details: err.message });
    });

    // Handle successful upload
    uploadStream.on('finish', async () => {
      const music = new Music({
        title,
        filePath: uploadStream.id, // Store the GridFS file ID
        userId
      });

      try {
        await music.save();
        res.status(201).json(music);
      } catch (err) {
        console.error('Error saving music metadata:', err);
        res.status(500).json({ error: 'Error saving music metadata' });
      }
    });

    // Pipe the file buffer into GridFS
    uploadStream.end(file.buffer);

  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get music file by file ID
router.get('/files/:fileId', ensureGFSInitialized, (req, res) => {
  const { fileId } = req.params;

  try {
    const downloadStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on('error', (error) => {
      console.error('Error:', error);
      res.status(404).json({ message: 'No file found' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch all music
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const music = await Music.find({userId : userId});
    res.json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch a single music item
router.get('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const music = await Music.findById(id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update music
router.put('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const music = await Music.findByIdAndUpdate(id, { title }, { new: true });
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete music
router.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const music = await Music.findById(id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    // Remove from GridFS
    gfs.delete(new mongoose.Types.ObjectId(music.filePath), (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      Music.findByIdAndDelete(id)
        .then(() => {
          res.json({ message: 'Music deleted successfully' });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
