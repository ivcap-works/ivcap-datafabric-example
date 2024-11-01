import { memo, type PiRegister } from "@pihanga2/core"

import { Icon } from "./app.icons"
import { JyPage3 } from "./cards/pageD3"
import { AppCard, AppState, TITLE } from "./app.types"

import registerLoginPage from "./login.pihanga"
import { NavBarT } from "./cards/pageD3/pageD3.types"
import { UserInfoEvent, dispatchIvcapLogout } from "@pihanga2/ivcap"
import { registerCollectionList } from "./collectionList.pihanga"
import { registerCollection } from "./collection.pihanga"

export function init(register: PiRegister): void {
  registerLoginPage(register)
  registerCollectionList(register)
  registerCollection(register)

  register.window<AppState>({
    page: (s) => (s.user ? AppCard.Main : AppCard.Login),
  })

  register.card(
    AppCard.Main,
    JyPage3<AppState>({
      navBar: memo<UserInfoEvent | undefined, NavBarT, AppState, unknown>(
        (s) => s.user,
        (user) => ({
          title: TITLE,
          logoIcon: Icon.Logo,
          user: user,
          showColorSchemeToggle: false,
        }),
      ),
      content: (s) => s.activePage,
      onUserLogout: (s, _, d) => {
        dispatchIvcapLogout(d)
        return s
      },
    }),
  )
}
