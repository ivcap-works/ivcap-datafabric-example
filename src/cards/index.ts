import { PiRegister } from "@pihanga2/core"

// Import all local components
import {  init as pageD3Init } from "./pageD3"

export * from "./pageD3"

export function init(register: PiRegister): void {
  pageD3Init(register)
}
