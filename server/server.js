const express = require('express');
const path = require('path');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Appollo server and pass in the schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  // start the ApolloServer

  await server.start();

  // integrate Apollo server as Express middleware

  server.applyMiddleware({ app });

  // log for testing
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// initialize ApolloServer

startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.statis(path.join(__dirname, '../client/build')));
}
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
