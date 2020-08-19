const express = require('express')
//const bodyPerser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const Event = require('./models/event')
const User = require('./models/user')


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
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
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User axist already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });

        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
    
  }
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


// "mongodb+srv://<username>:<password>@<cluster-address>/test?w=majority"
mongoose.connect(`mongodb://localhost:27017/${process.env.event_db}`)
 .then(() => {
  app.listen(3000)
  console.log('Running a GraphQL API server at http://localhost:3000/graphql');
 })
 .catch(err => {
   console.log(err);
 })

