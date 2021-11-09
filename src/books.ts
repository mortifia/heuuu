'use strict'
import { gql } from 'mercurius-codegen'

export const schema = gql`
  extend type Query {
    books: [Book!]
  }

  type Book {
    id: Int!,
    title: String!,
  }
`
export const resolvers = {
  Query: {
    books: () => [{ id: 1, title: "loool" }]
  }
}