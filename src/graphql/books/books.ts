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
  _returning: book,
  _returningField: null,
  //id: [false, 'book_id'],
  title: true,
  author: false,
}

export const resolvers: IResolvers = {
  Query: {
    books: async (parent, args, ctx, info) => {
      return await ctx.sql.unsafe(gqlToSql(book, fields(info)))
    },
  },
  Mutation: {
    bookAdd: async (parent, args, ctx, info) => {
      let tmp = Object.assign({}, bookAdd)
      // @ts-ignore
      tmp._returningField = fields(info)
      return await ctx.sql.unsafe(gqlToSql(tmp, args.input))
    },
  },
}
