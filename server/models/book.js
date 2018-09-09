const mongoose = require('mongoose');
const schema = mongoose.Schema;

// We don't have to include the "id:" field because MongoDB
// will create its own
const bookSchema = new schema({
	name: String,
	genre: String,
	authorId: String
});

// making a model (collection) of books that contains objects
// that look like the "bookSchema" schema
module.exports = mongoose.model('Book', bookSchema);