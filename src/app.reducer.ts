import { PiRegister, onShowPage, showPage } from "@pihanga2/core"
import {
  UserInfoEvent,
  dispatchIvcapLogout,
  onIvcapUserInfo,
  onOAuthProvider,
} from "@pihanga2/ivcap"
import { onUserLogout } from "@pihanga2/joy-ui"
import { AppState } from "./app.types"
// import { tracker } from "."

export const COLLECTION_PATH = "collections"

export function reducerInit(register: PiRegister): void {
  onShowPage<AppState>(register, (state, _, d) => {
    const path = state.route.path
    if (path.length === 0) {
      showPage(d, [COLLECTION_PATH])
    }
    if (path.length === 1 && path[0] === "logout") {
      showPage(d, [COLLECTION_PATH])
    }
  })

  onOAuthProvider<AppState>(register, (state, a) => {
    state.oauthProviders[a.id] = a
    // if (state.activePage === AppCard.JobList) refreshJobList()
    return state
  })

  onIvcapUserInfo<AppState>(register.reducer, (state, a) => {
    const ev = { ...a } as UserInfoEvent
    delete (ev as any)["type"] // ts hack
    state.user = ev
    // tracker.setUserID(ev.email ?? ev.name)
    return state
  })

  onUserLogout<AppState>(register, (state) => {
    dispatchIvcapLogout(register.reducer.dispatchFromReducer)
    return state
  })
}
