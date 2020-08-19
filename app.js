const express = require('express')
//const bodyPerser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require("mongoose")


const Event = require('./models/event')


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
    return Event.find().then(events => {
      return events.map(event => {
        return { ...event._doc };
      })
    }).catch(err => {
      throw err
    })
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
    });

    return event
      .save()
      .then((res) => {
        console.log(res);
        return { ...res._doc };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};

const app = express();

// app.use(bodyPerser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-instagram.tcmw7.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
 {useNewUrlParser: true})
 .then(() => {
  app.listen(3000)
  console.log('Running a GraphQL API server at http://localhost:3000/graphql');
 })
 .catch(err => {
   console.log(err);
 })

