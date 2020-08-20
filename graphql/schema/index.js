const { buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    events: [Event!]!
  }
  
  type Mutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
  }
`);

module.exports = schema