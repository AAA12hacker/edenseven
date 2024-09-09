const { MongoClient, GridFSBucket } = require("mongodb");

const initGFS = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    const client = await MongoClient.connect(mongoURI, {
      useUnifiedTopology: true,
    });
    const db = client.db();
    const gfs = new GridFSBucket(db, { bucketName: "uploads" });
    console.log("GridFS initialized");
    return gfs;
  } catch (error) {
    console.error("Failed to initialize GridFSBucket", error);
    throw error;
  }
};

module.exports = initGFS;
