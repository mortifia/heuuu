'use strict'
import { IResolvers } from 'mercurius' // to avoid interference
import { fields, gqlToSql } from '../../tools/index.js'

const book = {
  _: 'book.book',
  _type: 'SELECT',
  id: 'book_id as id',
  title: 'title',
  author: 'author',
}

const bookAdd = {
  _: 'book.book',
  _type: 'INSERT',
  id: [true, 'book_id'],
  title: true,
  author: true,
}

export const resolvers: IResolvers = {
  Query: {
    books: async (parent, args, ctx, info) => {
      const _fields = fields(info)
      console.log(gqlToSql(book, _fields))
      const tmp = await ctx.sql.unsafe(gqlToSql(book, _fields))
      return tmp
    },
  },
  Mutation: {
    bookAdd: async (parent, args, ctx, info) => {},
  },
}
