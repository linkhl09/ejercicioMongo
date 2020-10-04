const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';

function mongoUtils(){
  const mu = {};

  mu.conn = () => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.connect();
  }
  return mu;
}

module.exports = mongoUtils();