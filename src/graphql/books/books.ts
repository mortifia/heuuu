'use strict'
import { IResolvers } from 'mercurius' // to avoid interference
import { fields, gqlToSql } from '../../tools/index.js'

const book = {
  _: 'book.book',
  _type: 'SELECT',
  bookId: 'book_id as "bookId"',
  title: 'title',
  author: 'author',
  //full_count: 'count(*) OVER() AS _full_count', // TESSSST
  //_full_count: true,    // if true also return total nb of row wihout limit or offset
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
      const tmp = gqlToSql(book, fields(info))
      console.log(tmp)
      console.log(args)
      const tmp2 = await ctx.sql.unsafe(tmp)
      console.dir(tmp2)
      return tmp2
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
