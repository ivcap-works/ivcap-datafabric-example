import { PageLinks, URN } from "@pihanga2/ivcap"
import type { PiCardRef, ReduxState } from "@pihanga2/core"
import { OAuthProviderEvent, UserInfoEvent } from "@pihanga2/ivcap"

export const TITLE = "IVCAP Datafabric Example"
export const LONG_TITLE = TITLE

export const NS_PREFIX = "urn:sd-test:"

export const COLLECTION_SCHEMA = NS_PREFIX + "schema.example.collection.2"
export type CollectionT = {
  id: string
  name: string
  description: string
}

export const COLLECTION_ITEM_SCHEMA =
  NS_PREFIX + "schema.example.collection-item.2"
export type CollectionItemT = {
  name: string
  collectionURN: URN
  artifactURN: URN
  size: number
  contentType: string
}

//==== Redux State

export type CollectionListT = ListState<CollectionT>

export type AppState = ReduxState & CollectionState & PageState & AuthState

export type CollectionState = {
  collectionList?: CollectionListT
  collection?: {
    id: URN
    name?: string
    items: CollectionItemStateT[]
  }
}

export type CollectionItemStateT = CollectionItemT & {
  id: URN
  data?: string // should be URL
}

export type PageState = {
  activePage: PiCardRef
}

export type OAuthProviderListing = { [id: string]: OAuthProviderEvent }

export type AuthState = {
  user?: UserInfoEvent
  oauthProviders: OAuthProviderListing
}

//=== common

export enum AppCard {
  Framework = "page",
  Login = "app/login",
  Main = "app/main",

  Spinner = "app/spinner",
}

export type ListState<T> = {
  items: T[]
} & Partial<PageLinks>
