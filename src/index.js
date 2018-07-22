const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');

// en l'absence de DB, on utilisera des variables :

// let links = [{
//   id: 'link-0',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }];

// let idCount = links.length;

const resolvers = {
  Query,
  Mutation,
  AuthPayload
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/seb-durrbach/database/dev',
      secret: 'mysecret123',
      debug: true,
    })
  }),
});

server.start(() => console.log(`Server is running on localhost:4000`));