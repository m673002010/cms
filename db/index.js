const MongoClient = require('mongodb').MongoClient
global.mongoDb = null

async function connectDb() {
    if (mongoDb) return
    const client = new MongoClient(config.mongodbUrl)
    
    const res = await client.connect().catch(err => { 
        console.log('Connected mongodb fail', err)
        return null
    })
    if (!res) return null

    console.log('Connected successfully to mongodb')
    mongoDb = client.db('cms')
  
    return 'ok'
}

module.exports = {
    connectDb
}
