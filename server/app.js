const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

// connect to mLab database
mongoose.connect('mongodb://jenn:test123@ds251022.mlab.com:51022/gql-ninja');
// once a connection is made, fire off a function
mongoose.connection.once('open', () => {
	console.log('Connected to database')
});

// set up middleware. when a GraphQL request is made it is
// handed off to the express-graphql function
app.use('/graphql',graphqlHTTP({
	// below ES6 version of saying schema: schema
	schema,
	graphiql: true
}));

app.listen(4000, () => {
	console.log('now listening for requests on port 4000');
});