import { GraphQLResolveInfo } from 'graphql'

export function fields(info: GraphQLResolveInfo) {
  return info.fieldNodes[0].selectionSet!.selections?.map(info => {
    // @ts-ignore
    return info.name.value
  }) as string[]
}

export function fieldsDeep(info: GraphQLResolveInfo) {
  return info.fieldNodes[0]
    .selectionSet!.selections?.filter(
      // @ts-ignore
      connection => !connection.name.value.startsWith('__')
    )
    .map(connection => {
      return {
        // @ts-ignore
        [connection.name.value]: connection.selectionSet.selections
          ?.filter(
            (field: { name: { value: String } }) =>
              !field.name.value.startsWith('__')
          )
          .map((field: { name: { value: String } }) => {
            //console.dir(field.name)
            return field.name.value
          }),
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
  if (argReady?._pageInfo) {
    return {
      page: argReady._pagination?.page || 0,
      allPage: Math.ceil(
        (returnSql[0]?._pageinfo || 0) / (argReady._pagination?.size || 100)
      ),
      scale: argReady._pagination?.size || 100,
    }
  }
  return {}
}
