const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')


const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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

