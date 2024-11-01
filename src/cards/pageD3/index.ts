import { PiRegister, actionTypesToEvents } from "@pihanga2/core"

import { PageD3Component } from "./pageD3.component"
import { PAGE3_TYPE, PAGE3_ACTION } from "./pageD3.types"

export * from "./pageD3.types"

export function init(register: PiRegister): void {
  register.cardComponent({
    name: PAGE3_TYPE,
    component: PageD3Component,
    events: actionTypesToEvents(PAGE3_ACTION),
  })
}
