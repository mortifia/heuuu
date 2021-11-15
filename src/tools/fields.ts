import { GraphQLResolveInfo } from 'graphql'

export function fields(info: GraphQLResolveInfo) {
  return info.fieldNodes[0].selectionSet!.selections.map(info => {
    // @ts-ignore
    return info.name.value
  }) as string[]
}
