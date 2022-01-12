'use strict'
import { GraphQLResolveInfo } from 'graphql'
import { IResolvers } from 'mercurius' // to avoid interference
import {
  fields,
  fieldsDeep,
  gqlToSql,
  keyStartAdd,
  pageInfo,
  prepareArgs,
  prepareArgsDeep,
  renameKey,
} from '../../tools/index.js'

const book = {
  _: 'book.book',
  _type: 'SELECT',
  id: 'book_id as "id"',
  title: 'title',
  author: 'author',
}

const bookAdd = {
  _: 'book.book',
  _type: 'INSERT',
  _returning: book,
  _returningField: null,
  //id: [false, 'book_id'],
  title: true,
  //author: false,
}

export const resolvers: IResolvers = {
  Query: {
    books: async (parent, args: {}, ctx, info) => {
      const argReady = prepareArgsDeep(args, info, 'books')
      const sql = gqlToSql(book, argReady)
      const returnSql = await ctx.sql.unsafe(sql)
      return { books: returnSql, _pageInfo: pageInfo(argReady, returnSql) }
    },
  },

  Mutation: {
    bookAdd: async (parent, args, ctx, info) => {
      let tmp: { [key: string]: any } = Object.assign({}, bookAdd)
      tmp._returningField = fields(info)
      return await ctx.sql.unsafe(gqlToSql(tmp, args.input))
    },
  },
}
