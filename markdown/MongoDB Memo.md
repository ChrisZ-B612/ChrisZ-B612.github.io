MongoDB Memo
---
### References
[http://www.tutorialspoint.com/mongodb/index.htm](http://www.tutorialspoint.com/mongodb/index.htm)
### Setup
* Start Server: `mongod.exe --dbpath "D:\Program Files\MongoDB\Server\3.2\data"`
* Start Client: `mongo.exe`

### Quick APIs
* Show Collections: `show collections`
* Drop Collection: `db.COLLECTION_NAME.drop()`
* ---
* Insert Document: `db.COLLECTION_NAME.insert(document | [doc1, doc2...])`
* Update Document: `db.COLLECTION_NAME.update(SELECTIOIN_CRITERIA, UPDATED_DATA)`
* Insert/Update Document: `db.COLLECTION_NAME.save(document | [doc1, doc2...])`
* ---
* aggregate: `db.COLLECTION_NAME.aggregate(AGGREGATE_OPERATION)`

### Quick Notes
* _id is 12 bytes hexadecimal number unique for every document, divided as follows: `_id: ObjectId(4 bytes timestamp, 3 bytes machine id, 2 bytes process id, 3 bytes incrementer)`