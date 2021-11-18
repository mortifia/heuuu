import { GraphQLResolveInfo } from 'graphql'

export function fields(info: GraphQLResolveInfo) {
  return info.fieldNodes[0].selectionSet!.selections.map(info => {
    // @ts-ignore
    return info.name.value
  }) as string[]
}

export function fieldsDeep(info: GraphQLResolveInfo) {
  return info.fieldNodes[0]
    .selectionSet!.selections.map(connection => {
      return {
        // @ts-ignore
        [connection.name.value]: connection.selectionSet.selections.map(
          (field: { name: { value: String } }) => {
            return field.name.value
          }
        ),
      }
    })
    .reduce((old, key) => ({ ...old, ...key }))
}

export function keyStartAdd(Obj: { [key: string]: any }, add: String) {
  for (const key in Obj) {
    Obj[add + key] = Obj[key]
    delete Obj[key]
  }
  return Obj
}

export function renameKey(
  Obj: { [key: string]: any },
  oldkey: string,
  newKey: string
) {
  Obj[newKey] = Obj[oldkey]
  delete Obj[oldkey]
  return Obj
}

export function prepareArgs(args: {}, info: GraphQLResolveInfo) {
  return { ...keyStartAdd(args, '_'), ...fields(info) }
}

export function prepareArgsDeep(
  args: {},
  info: GraphQLResolveInfo,
  keyColumn: string
) {
  return renameKey(
    { ...keyStartAdd(args, '_'), ...fieldsDeep(info) },
    keyColumn,
    '_column'
  )
}

export function pageInfo(argReady: { [key: string]: any }, returnSql: any[]) {
  if (argReady._pageInfo) {
    return {
      page: argReady._pagination.page || 1,
      allPage: Math.ceil(
        returnSql[0]._pageinfo / (argReady._pagination.size || 100)
      ),
      scale: argReady._pagination.size || 50,
    }
  }
  return {}
}
