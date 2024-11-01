import { memo, type PiRegister } from "@pihanga2/core"

import { Icon } from "./app.icons"
import { JyLogin, type LoginWithProviderEvent } from "@pihanga2/joy-ui"
import { AppState, OAuthProviderListing } from "./app.types"
import { AUTH_PROVIDER_ICONS, LoginProvider } from "@pihanga2/joy-ui"
import { IVCAP_AUTH_ACTION } from "@pihanga2/ivcap"
import { LONG_TITLE } from "./app.types"
import { AppCard } from "./app.types"

export default function registerLoginPage(register: PiRegister) {
  register.card(
    AppCard.Login,
    JyLogin<AppState>({
      headerTitle: LONG_TITLE,
      headerIcon: Icon.Logo,
      loginProviders: memo<
        OAuthProviderListing,
        LoginProvider[],
        AppState,
        unknown
      >(
        (s) => s.oauthProviders,
        (p) =>
          Object.values(p).map((el) => ({
            id: `${el.id}|${el.ivcapURL}`,
            title: `Continue with ${el.name}`,
            logo: AUTH_PROVIDER_ICONS[el.id],
          })),
      ),
      showBackground: true,
      backgroundURL: "login.png",
      //withLoginForm: true,
      onWithProviderMapper: ({ providerID }: LoginWithProviderEvent) => ({
        type: IVCAP_AUTH_ACTION.LOGIN_TO_PROVIDER,
        providerID: providerID.split("|")[0],
        ivcapURL: providerID.split("|")[1],
      }),
    }),
  )
}
