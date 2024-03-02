export const values = <T>(
  obj: Record<string | number, T> | T[] | undefined
): T[] => (obj === undefined ? [] : Object.values(obj))

export const entries = <T>(obj: Record<string, T>): [string, T][] =>
  Object.entries(obj)

export const toRecord = <T>(arr: T[]) => {
  return arr.reduce((acc, item, index) => {
    acc[index] = item
    return acc
  }, {} as Record<number, T>)
}
