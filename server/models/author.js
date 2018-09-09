const mongoose = require('mongoose');
const schema = mongoose.Schema;

// We don't have to include the "id:" field because MongoDB
// will create its own
const authorSchema = new schema({
	name: String,
	age: Number
});

// making a model (collection) of authors that contains objects
// that look like the "authorSchema" schema
module.exports = mongoose.model('Author', authorSchema);