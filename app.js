const express = require('express')
//const bodyPerser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql');


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    events: [String!]!
  }
  
  type Mutation {
    createEvent(name: String): String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  events: () => {
    return ['dbcsdcbd', 'sdkuhdkscs', 'dsygieygfiyg']
  },
  createEvent: (args) => {
    const eventName = args.name
    return eventName
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