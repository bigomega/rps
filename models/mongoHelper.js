const { MongoClient, ObjectId } = require('mongodb')

const db_url = 'mongodb://localhost:27017/'
const db_name = 'rps'

module.exports.Helper = {
  _collectionName: '',
  _getDb() {
    return MongoClient.connect(db_url, { useNewUrlParser: true })
      .then(client => client.db(db_name))
      .catch(console.log.bind(console, 'Mongo error:'))
    ;
  },
  _getCollection() {
    return this._getDb().then(db => db.collection(this._collectionName))
  },
  getById(id) {
    return this._getCollection().then(col => col.find({ _id: ObjectId(id) }).toArray()).then(arr => arr.pop())
  },
  create(obj) {
    delete obj._id
    return this._getCollection().then(col => col.insertOne(obj))
  },
  query(query) {
    return this._getCollection().then(col => col.find(query).toArray())
  },
  queryOne(query) {
    return this.query(query).then(arr => arr.pop())
  },
}

module.exports.Blog = Object.assign({}, module.exports.Helper, {
  _collectionName: 'blogs',
})

module.exports.User = Object.assign({}, module.exports.Helper, {
  _collectionName: 'users',
  findOrCreate: async function(type, info) {
    let query = {}
    query = { [`${type}.id`]: info.id }
    const user = await this.queryOne(query)
    if (user) { return user }
    // else
    await this.create({ [type]: info })
    return this.queryOne(query)
  }
})
