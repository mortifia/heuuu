import { ApolloServer } from 'apollo-server-express';
//import { GraphQLResolverMap } from 'apollo-graphql';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import joinMonster from 'join-monster';
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import postgres from 'postgres';

const db = postgres('postgres://heuuu:heuuu@localhost:5432/heuuu')
db`SELECT * FROM books.books`.then((heuu) => { console.log(heuu) });

//!    ok ???
const Book = new GraphQLObjectType({
  name: 'Book',
  extensions: {
    joinMonster: {
      sqlTable: 'books.books',
      uniqueKey: 'id',
    }
  },
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    }
  })
})

//!    ok ???
const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    books: {
      type: new GraphQLList(Book),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql: string) => { // yes forced to use default to work
          return db(sql);
        })
      },
    }
  })
})

//!    ok ???
var schema = new GraphQLSchema({
  query: QueryRoot,
  description: 'huhuhu'
})

// all ok here
async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  //await httpServer.listen({ port: 4000 });
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

console.dir(schema)
startApolloServer(schema)
