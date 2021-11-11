'use strict'
import { GraphQLResolveInfo } from 'graphql'
import { IResolvers } from 'mercurius'
import postgres from 'postgres'

// generate sql with sheme for build sql and info of actual resolver to match exatly to the request
function gqlToSql(schemeSql: typeof book, infoGql: GraphQLResolveInfo) {
  const field = infoGql.fieldNodes[0].selectionSet?.selections.map(info => {
    return info.name.value
  })
  // add the sql type (select | remove | ect ect)
  let sql = `${schemeSql._type}`
  // add field requested to sql
  field?.forEach((fieldRequired: String | Object, pos) => {
    if (typeof fieldRequired === 'string') {
      sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
    }
  })
  // add table to sql
  sql += ` FROM ${schemeSql._}`
  return sql
}

const book = {
  _: 'book.book',
  _type: 'SELECT',
  id: 'book_id as id',
  title: 'title',
  author: 'author',
}

export const resolvers: IResolvers = {
  Query: {
    // books: () => [{ id: 1, title: "loool", author: "roibert" }],
    books: async (parent, args, ctx, info) => {
      console.log(gqlToSql(book, info))
      const tmp = await ctx.sql.unsafe(gqlToSql(book, info))
      return tmp
    },
  },
}
