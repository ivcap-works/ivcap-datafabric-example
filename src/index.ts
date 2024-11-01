import { start, getLogger, DEFAULT_REDUX_STATE } from "@pihanga2/core"
import { init as pihangaInit } from "./app.pihanga"
// import Tracker from "@openreplay/tracker"

import {
  ivcapInit,
  registerIvcapDeployment,
  setAccessToken,
} from "@pihanga2/ivcap"
import { AppState } from "./app.types"

import { init as joyInit } from "@pihanga2/joy-ui"
import { init as cardInit } from "@pihanga2/cards"

import { reducerInit } from "./app.reducer"

import { init as customCardsInit } from "./cards"
//import { debug_init } from "./app.debug.state"

const logger = getLogger("app")

const accessToken = import.meta.env.VITE_IVCAP_JWT
if (accessToken) {
  logger.info("using local access token 'VITE_IVCAP_JWT'")
  setAccessToken(accessToken)
}

const ivcapURL = new URL(
  import.meta.env.VITE_IVCAP_URL || "https://develop.ivcap.net",
)
registerIvcapDeployment(ivcapURL)

const inits = [
  joyInit,
  cardInit,
  customCardsInit,
  pihangaInit,
  ivcapInit,
  reducerInit,
]

const initState: AppState = {
  activePage: "???", // AppCard.CollectionListPage,
  oauthProviders: {},
  ...DEFAULT_REDUX_STATE,
}

// export const tracker = new Tracker({
//   projectKey: import.meta.env.VITE_OPEN_REPLAY_PROJECT_KEY,
//   // ingestPoint: "https://openreplay.mydomain.com/ingest", // when dealing with the self-hosted version of OpenReplay
//   capturePerformance: true,
//   resourceBaseHref: "https://crewai.develop.ivcap.io",
//   __DISABLE_SECURE_MODE: true, // for local testing
// })
// tracker.start()

start(initState, inits, { disableSerializableStateCheck: true })
