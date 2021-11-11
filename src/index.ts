"use strict";
console.log("\nstart\n");
const serviceName = "service-add"; //tracing
import { tracer } from "./tracer.js"; //tracing
tracer(serviceName); //tracing

import Fastify, { FastifyInstance, FastifyRegisterOptions } from "fastify";
import { buildSchema } from "graphql";

import glob from "tiny-glob";

import mercurius, {
  IResolvers,
  MercuriusOptions,
  MercuriusSchemaOptions,
} from "mercurius";
import mercuriusCodegen, { loadSchemaFiles, gql } from "mercurius-codegen";
import lodash from "lodash";
const merge = lodash.merge;

import opentelemetry from "@autotelic/fastify-opentelemetry"; //tracing

const server: FastifyInstance = Fastify({});

const resolvers = await (async () => {
  let resolvers = {};
  const path = await glob("./build/graphql/**/*{.js}", { absolute: true });
  for (let index = 0; index < path.length; index++) {
    resolvers = merge(resolvers, (await import(path[index])).resolvers);
    console.log(`lib loaded:  ${path[index]}`);
  }
  console.log("end loading resolver\n");
  return resolvers;
})();

/*
  merge schemas and build typescript definition
  with watcher for dev only */
const { schema } = loadSchemaFiles("src/graphql/**/*.gql", {
  watchOptions: {
    enabled: process.env.NODE_ENV === "development",
    onChange(schema) {
      server.graphql.replaceSchema(buildSchema(schema.join("\n")));
      server.graphql.defineResolvers(resolvers);
      mercuriusCodegen(server, {
        targetPath: "./src/graphql/generated.ts",
      }).catch(console.error);
    },
  },
});

/* options for graphql service */
const mercuriusOpt: FastifyRegisterOptions<MercuriusOptions> = {
  schema: schema,
  resolvers: resolvers,
  graphiql: true,
  jit: 3,
  path: "/",
};

const start = async () => {
  try {
    // @ts-ignore
    server.register(opentelemetry, { serviceName });
    server.register(mercurius, mercuriusOpt);
    await server.listen(3000);
    const address = server.server.address();
    typeof address === "string"
      ? console.log(`🟩 run in ${address}${mercuriusOpt.path}`)
      : console.log(
          `🟩 run in http://${address?.address}:${address?.port}${mercuriusOpt.path}`
        );
  } catch (err) {
    console.error(`🟥 error in launch`);
    console.error(err);
    server.log.error(err);
    process.exit(1);
  }
};
start();
