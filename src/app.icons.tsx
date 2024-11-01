import SvgIcon from "@mui/joy/SvgIcon"
import { memo } from "react"

import { registerMuiIcon } from "@pihanga2/joy-ui"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"

import { registerIcon } from "@pihanga2/cards"

export enum Icon {
  Logo = registerIcon(memo(IvcapIcon), "ivcap"), // registerMuiIcon(DashboardRoundedIcon),
  Back = registerMuiIcon(ChevronLeftIcon),
}

function IvcapIcon() {
  return (
    <SvgIcon fontSize="xl">
      <g stroke="currentColor" fill="none">
        <path
          d="M 7 5 A 9.6 9.6, 0, 1, 0, 22 15 M 12 8 L 12 18"
          strokeWidth="3"
        />
        <circle cx="12" cy="3.5" r="2.5" strokeWidth="2" />
      </g>
    </SvgIcon>
  )
}
