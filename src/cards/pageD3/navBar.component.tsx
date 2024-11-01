import * as React from "react"
import { Box } from "@mui/joy"
import Typography from "@mui/joy/Typography"
import Link from "@mui/joy/Link"
import Stack from "@mui/joy/Stack"
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork"
import { useColorScheme } from "@mui/joy/styles"
import IconButton, { IconButtonProps } from "@mui/joy/IconButton"

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeIcon from "@mui/icons-material/LightMode"

import { renderUser } from "./user.component"
import { LinkT, NavBarT, NavLinkEvent, UserLogoutEvent } from "./pageD3.types"
import { IconId, getIcon } from "@pihanga2/cards"

export default function renderNavbar(
  props: NavBarT,
  onNavLink: (ev: NavLinkEvent) => void,
  onUserLogout: (ev: UserLogoutEvent) => void,
) {
  const { title, logoIcon, links, user, showColorSchemeToggle } = props

  const outer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    top: 0,
    px: 1.5,
    py: 1,
    zIndex: 10000,
    backgroundColor: "background.body",
    borderBottom: "1px solid",
    borderColor: "divider",
    position: "sticky",
  }
  const leftBox = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  }
  return (
    <Box sx={outer}>
      <Box sx={leftBox}>
        {renderLogo(logoIcon)}
        <Typography component="h1" sx={{ fontWeight: "xl" }}>
          {title}
        </Typography>
        {links && renderLinks(links, onNavLink)}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {user && renderUser(user, onUserLogout)}
        {showColorSchemeToggle && (
          <ColorSchemeToggle sx={{ alignSelf: "center" }} />
        )}
      </Box>
    </Box>
  )
}

function renderLogo(logoIcon?: IconId) {
  if (!logoIcon) return null

  return (
    <IconButton variant="plain" color="primary" size="sm">
      {getIcon(logoIcon)}
    </IconButton>
  )
}

function renderLinks(links: LinkT[], onNavLink: (ev: NavLinkEvent) => void) {
  const sx = { px: 2 }

  function renderLink(l: LinkT) {
    return (
      <Link
        component="button"
        onClick={() => onNavLink({ id: l.id })}
        variant="plain"
        key={l.id}
      >
        {l.label}
      </Link>
    )
  }

  return (
    <Stack spacing={2} direction={"row"} sx={sx}>
      {links.map(renderLink)}
    </Stack>
  )
}

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, sx, ...other } = props
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return (
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        {...other}
        sx={sx}
        disabled
      />
    )
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark")
        } else {
          setMode("light")
        }
        onClick?.(event)
      }}
      sx={[
        mode === "dark"
          ? { "& > *:first-of-type": { display: "none" } }
          : { "& > *:first-of-type": { display: "initial" } },
        mode === "light"
          ? { "& > *:last-of-type": { display: "none" } }
          : { "& > *:last-of-type": { display: "initial" } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRoundedIcon />
      <LightModeIcon />
    </IconButton>
  )
}
