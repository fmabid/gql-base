const express = require('express')
//const bodyPerser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql');


const events = [];


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type Query {
    events: [Event!]!
  }
  
  type Mutation {
    createEvent(eventInput: EventInput): Event
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  events: () => {
    return events
  },
  createEvent: (args) => {
    const event = {
      _id: Math.random().toString(),
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: args.eventInput.date,
    };
    events.push(event)
    return event
  }
};

const app = express();

// app.use(bodyPerser.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(3000)
console.log('Running a GraphQL API server at http://localhost:3000/graphql');