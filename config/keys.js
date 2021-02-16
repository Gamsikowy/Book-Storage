module.exports = {
    // link your DB
    //MongoURI: 'mongodb+srv://gamsikowy:gamsikowy@cluster0-letb5.mongodb.net/test?retryWrites=true&w=majority'
    MongoURI: `mongodb+srv://gamsikowy:${process.env.DB_PASSWORD}@cluster0-letb5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
}