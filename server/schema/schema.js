const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// describe the object types in our schema
// using ES6 destructuring to grab specific functions
// from the 'graphql' package so we can easily
// reference them and use within this file
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// dummy data
// var books = [
// 	{name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorid: '1'},
// 	{name: 'The Final Empire', genre: 'Fantasy', id: '2', authorid: '2'},
// 	{name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorid: '3'},
// 	{name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorid: '2'},
// 	{name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorid: '3'},
// 	{name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorid: '3'},
// ];

// var authors = [
// 	{name: 'Patrick Rothfuss', age: 44, id: '1'},
// 	{name: 'Brandon Sanderson', age: 42, id: '2'},
// 	{name: 'Terry Pratchett', age: 66, id: '3'},
// ]

// define object types
const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				// return _.find(authors, { id: parent.authorid });
				return Author.findById(parent.authorId)
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, { authorid: parent.id });
				return Book.find({ authorId: parent.id })
			}
		}
	})
});

// defines the types of data a user can jump directly to
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			// this says that when someone queries a book
			// they are expected to pass along specific arguments
			// in order to determine which book they're looking for
			args: { id: { type: GraphQLID }},
			resolve(parent, args) {
				// code to get data from db / other source
				// using "lodash"
				// return _.find(books, { id: args.id });
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(authors, { id: args.id });
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return books;
				// find on an empty object will return all items
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent,args) {
				// return authors;
				return Author.find({});
			}
		}
	}
});

// defines the type of changes/mutations we can make to the data
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parent, args) {
				// Author here is the model we created and imported
				// creating an instance of the Author model
				let author = new Author({
					name: args.name,
					age: args.age
				});
				// saves to the database, handled by mongoose
				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});

				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	// stuff that can be queried
	query: RootQuery,
	// stuff that can be changed
	mutation: Mutation
});