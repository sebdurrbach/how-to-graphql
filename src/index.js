const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

// en l'absence de DB, on utilisera des variables :

// let links = [{
//   id: 'link-0',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }];

// let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    },
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info);
    },
  },
  // Link resolver est ici facultatif à l'exécution de la requête
  // GraphQL Server déduit lui-même sa composition
  // Link: {
  //   id: (root) => root.id,
  //   description: (root) => root.description,
  //   url: (root) => root.url,
  // }
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