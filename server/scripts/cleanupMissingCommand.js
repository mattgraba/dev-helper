require('dotenv').config();
const { MongoClient } = require('mongodb');

async function cleanup() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db(); // default DB from URI

    const result = await db.collection('responses').deleteMany({
      $or: [
        { input: { $in: [null, '', 'undefined'] } },
        { output: { $in: [null, '', 'undefined'] } },
        { command: { $in: [null, '', 'undefined'] } },
      ],
    });

    console.log(`🧹 Deleted ${result.deletedCount} history records with missing/invalid input/output/command`);
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
  } finally {
    await client.close();
  }
}

cleanup();
