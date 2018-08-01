//  ------ MONGOOSE ------

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/rps', { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connnected')

//   var kittySchema = new mongoose.Schema({
//     name: String
//   });
//   kittySchema.methods.speak = function () {
//     var greeting = this.name
//       ? "Meow name is " + this.name
//       : "I don't have a name";
//     console.log(greeting);
//   }

//   var Kitten = mongoose.model('Kitten', kittySchema);
//   // var fluffy = new Kitten({ name: 'fluffy' });
//   // fluffy.speak(); // "Meow name is fluffy"


//   // fluffy.save(function (err, fluffy) {
//   //   if (err) return console.error(err);
//   //   // fluffy.speak();
//   // });

//   Kitten.find(function (err, kittens) {
//     if (err) return console.error(err);
//     console.log(kittens);
//   })
// });

//  ------ MONGO ------

const MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
//   .then(client => client.db('rps'))
//   .then(db => db.collection('kittens').find({}).toArray())
//   .then(result => {
//     console.log(result)
//   })
//   .catch(console.error.bind(console, 'Connection error:'))
// ;

const getFN = async function() {
  // Connection URL
  const url = 'mongodb://localhost:27017/';
  // Database Name
  const dbName = 'rps';
  let client;

  try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url, { useNewUrlParser: true });

    const db = client.db(dbName);
    const col = db.collection('kittens');
    const res = await col.find({}).toArray()
    return res
  } catch (err) {
    console.log(err.stack);
  }

  if (client) {
    client.close();
  }
}

getFN().then(console.log)
