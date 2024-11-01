import { SxProps } from "@mui/material"
import { IconId, VariantT } from "@pihanga2/cards"
import {
  PiCardRef,
  createCardDeclaration,
  createOnAction,
  registerActions,
} from "@pihanga2/core"

export const PAGE3_TYPE = "joy/pageD3"
export const JyPage3 = createCardDeclaration<PageD3Props, PageD3Events>(
  PAGE3_TYPE,
)

export type PageD3Props<S = any> = {
  navBar: NavBarT
  pageHeader?: HeaderT
  search?: SearchT
  content: PiCardRef
  style?: S
}

export type JyPageD3Style = {
  joy: {
    outer?: SxProps
    inner?: SxProps
  }
}

export const PAGE3_ACTION = registerActions(PAGE3_TYPE, [
  "nav_link",
  "search",
  "user_logout",
])

export type NavBarT = {
  title: string
  logoIcon?: IconId
  links?: LinkT[]
  user?: UserT
  showColorSchemeToggle?: boolean
}

export type LinkT = {
  id: string
  label: string
  variant?: VariantT
}

export type HeaderT = {
  title: string
  subTitle?: string
}

export type UserT = {
  name: string
  email?: string
  avatarSrc?: string
}

export type SearchT = {
  showing: boolean
  label?: string // default "Search"
  comment?: string // e.g. 12 records for 'Foo'
}

export type NavLinkEvent = { id: string }
export const onNavLink = createOnAction<SearchEvent>(PAGE3_ACTION.NAV_LINK)

export type UserLogoutEvent = {}
export const onUserLogout = createOnAction<UserLogoutEvent>(
  PAGE3_ACTION.USER_LOGOUT,
)

export type SearchEvent = { searchText: string }
export const onSearch = createOnAction<SearchEvent>(PAGE3_ACTION.SEARCH)

export type PageD3Events = {
  onNavLink: NavLinkEvent
  onSearch: SearchEvent
  onUserLogout: UserLogoutEvent
}
