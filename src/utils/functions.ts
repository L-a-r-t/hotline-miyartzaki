import dayjs, { ManipulateType } from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/fr"
dayjs.extend(customParseFormat)

export const dayjsFromYYYYMMDD = (date: string) => {
  return dayjs(date, "YYYY-MM-DD").locale("fr")
}

export const dayjsWithDelta = (
  delta: number,
  deltaType: ManipulateType = "day"
) => {
  return dayjs().add(delta, deltaType).locale("fr")
}

export const values = <T>(
  obj: Record<string | number, T> | T[] | undefined
): T[] => (obj === undefined ? [] : Object.values(obj))

export const entries = <T>(obj: Record<string, T>): [string, T][] =>
  !obj ? [] : Object.entries(obj)

export const toRecord = <T>(arr: T[]) => {
  return arr.reduce((acc, item, index) => {
    acc[index] = item
    return acc
  }, {} as Record<number, T>)
}

export const toShortId = (id: string) => {
  return id.slice(0, 6)
}
