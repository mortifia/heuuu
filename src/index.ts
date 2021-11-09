'use strict'
import Fastify, { FastifyInstance, FastifyRegisterOptions } from 'fastify'
import mercurius, { IResolvers, MercuriusOptions, MercuriusSchemaOptions } from 'mercurius'
import lodash from 'lodash';
const merge = lodash.merge;

import { gql } from 'mercurius-codegen';

import { schema as sbooks, resolvers as rBooks } from './books.js'

const schema = gql`
  type Query {_:Boolean}
  type Mutationn {_:Boolean}
`
// main resolver avoid populate here
const resolvers = {}

const mercuriusOpt: FastifyRegisterOptions<MercuriusOptions> = {
    schema: [schema, sbooks],
    resolvers: merge(resolvers, rBooks),
    graphiql: true,
    jit: 3,
    path: '/',
}

const server: FastifyInstance = Fastify({})


const start = async () => {
    try {
        server.register(mercurius, mercuriusOpt)
        await server.listen(3000)
        const address = server.server.address()
        typeof address === 'string' ? console.log(`🟩 run in ${address}${mercuriusOpt.path}`) : console.log(`🟩 run in http://${address?.address}:${address?.port}${mercuriusOpt.path}`)
    } catch (err) {
        console.error(`🟥 error in launch`);
        console.error(err);
        server.log.error(err)
        process.exit(1)
    }
}
start()