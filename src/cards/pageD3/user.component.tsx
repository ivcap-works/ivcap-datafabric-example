import Box from "@mui/joy/Box"
import Typography from "@mui/joy/Typography"
import Avatar from "@mui/joy/Avatar"
import IconButton from "@mui/joy/IconButton"
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded"

import { UserLogoutEvent, UserT } from "./pageD3.types"

export function renderUser(
  user: UserT,
  onUserLogout: (ev: UserLogoutEvent) => void,
) {
  if (!user) return null

  return (
    <Box
      sx={{ gap: 1, alignItems: "center", display: { xs: "none", sm: "flex" } }}
    >
      {renderUserAvatar(user)}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography level="title-sm">{user.name}</Typography>
        {user.email && <Typography level="body-xs">{user.email}</Typography>}
      </Box>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={() => onUserLogout({})}
      >
        <LogoutRoundedIcon />
      </IconButton>
    </Box>
  )
}

function renderUserAvatar(user: UserT) {
  if (user?.avatarSrc) {
    return <Avatar variant="outlined" size="sm" src={user?.avatarSrc} />
  } else {
    return (
      <Avatar variant="outlined" size="sm">
        {user?.name.slice(0, 1)}
      </Avatar>
    )
  }
}
