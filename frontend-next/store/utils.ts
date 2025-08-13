import { SetStateAction } from "react"

export function apply<T>(prev: T, value: SetStateAction<T>): T {
  return typeof value === "function" ? (value as any)(prev) : value
}
