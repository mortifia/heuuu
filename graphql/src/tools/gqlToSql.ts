// generate sql with sheme for build sql and info of actual resolver to match exatly to the request
export function gqlToSql(schemeSql: { [key: string]: any }, args: any[] | {}) {
  switch (schemeSql._type) {
    case 'SELECT':
    case 'select':
      return gqlToSqlSelect(schemeSql, args)
    case 'INSERT':
    case 'insert':
      return gqlToSqlInsert(schemeSql, args)
    default:
      throw new Error('gqlToSql type of request not supported')
  }
}
/* EXAMPLE or return
  INSERT INTO films (code, title, did, date_prod, kind) VALUES
    ('B6717', 'Tampopo', 110, '1985-02-10', 'Comedy'),
    ('HG120', 'The Dinner Game', 140, DEFAULT, 'Comedy');
 */
function gqlToSqlInsert(schemeSql: { [key: string]: any }, args: any[] | {}) {
  // add inser into & table & colums
  let sql = `INSERT INTO ${schemeSql._} (${Object.keys(schemeSql)
    .filter(key => key[0] !== '_')
    .join(', ')}) VALUES \n  ${gqlToSqlInsertData(schemeSql, args)}` // add the sql type (select | remove | insert | ect ect)
  // sert a dire ce que l'on veut du retour
  if (
    schemeSql._returning !== undefined &&
    Array.isArray(schemeSql._returningField)
  ) {
    sql += `\nreturning`
    schemeSql._returningField.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql._returning[fieldRequired]}`
      }
    })
  }
  return sql
}

function gqlToSqlInsertData(
  schemeSql: { [key: string]: any },
  args: any[] | { [key: string]: any }
) {
  if (Array.isArray(args)) {
    let tmp: string[] = []
    args!.forEach((row: {}, pos) => {
      tmp.push(gqlToSqlInsertData(schemeSql, row))
    })
    return tmp.join(',\n  ')
  } else {
    // finish with only undefine security
    let sql = '('
    Object.keys(schemeSql)
      .filter(key => key[0] !== '_')
      .forEach((collumn, pos) => {
        const value = args[collumn]
        value === undefined
          ? (sql += `${pos === 0 ? '' : ', '}NULL`)
          : (sql += `${pos === 0 ? '' : ', '}${
              isNaN(value) ? `'${value}'` : value
            }`)
      })
    return (sql += ')')
  }
}

function gqlToSqlSelect(
  schemeSql: { [key: string]: any },
  args: any[] | { [key: string]: any }
) {
  let sql = `SELECT` // add the sql type (select | remove | insert | ect ect)

  // add field requested to sql
  if (Array.isArray(args)) {
    args?.forEach((fieldRequired: String | Object, pos) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
      }
    })
  } else {
    args._column.forEach((fieldRequired: String | Object, pos: number) => {
      if (typeof fieldRequired === 'string') {
        sql += `${pos === 0 ? '' : ','} ${schemeSql[fieldRequired]}`
      }
    })

    // get nb total of row with select rules ONLY if needed
    if (
      args._pageInfo !== undefined &&
      args._pageInfo !== null &&
      args._pageInfo !== false
    ) {
      sql += `, count(*) OVER() AS _pageInfo`
    }
  }

  // add table to sql
  sql += ` FROM ${schemeSql._}`

  //add where requested
  if (!Array.isArray(args)) {
    //where or
    for (let indexOR = 0; indexOR < args?._input?.length; indexOR++) {
      indexOR === 0 ? (sql += '\n  WHERE') : (sql += '\n    OR')
      let first = true
      //where and.column
      for (const key in args._input[indexOR]) {
        const column = schemeSql[key].split(' ')[0]
        //where and.column.range
        args._input[indexOR][key].range?.forEach(
          (range: { not: boolean; start: any; end: any }) => {
            sql += `${first === true ? '' : '\n    AND'} ${column} ${
              range.not === true ? 'NOT ' : ''
            }BETWEEN ${range.start} AND ${range.end}`
            if (first === true) first = false
          }
        )
        //where and.column.array
        if (Array.isArray(args._input[indexOR][key].array)) {
          const string =
            typeof args._input[indexOR][key].array[0] === 'string'
              ? '"' + args._input[indexOR][key].array.join('","') + '"'
              : args._input[indexOR][key].array
          sql += `${
            first === true ? '' : '\n    AND'
          } ${column} = ANY('{${string}}')`
        }
      }
    }
  }

  //add group by
  if (!Array.isArray(args)) {
    if (args._order) {
      sql += `\n  ORDER BY${args._order.map(
        (order: { type: string; order: string }) => {
          return ` ${
            schemeSql[order.type].split(' ')[0] +
            (order.order ? ` ${order.order}` : '')
          }`
        }
      )}`
    }
  }

  // add limit and offset
  if (!Array.isArray(args)) {
    sql += `\n  LIMIT ${args._pagination?.size || 50}${
      (args._pagination?.page || 0) >= 0
        ? '\n  OFFSET ' +
          (args._pagination?.size || 50) * (args._pagination?.page || 0)
        : ''
    }`
  }
  return sql
}

//  https://teams.live.com/meet/94885272510512
