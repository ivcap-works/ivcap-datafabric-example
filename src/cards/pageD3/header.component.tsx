import * as React from "react"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { HeaderT } from "./pageD3.types"

export default function renderHeader(props: HeaderT) {
  const { title, subTitle } = props

  const sx = {} // { mb: 2 }
  return (
    <Stack sx={sx}>
      <Typography level="h2">{title}</Typography>
      {subTitle && (
        <Typography level="body-md" color="neutral">
          {subTitle}
        </Typography>
      )}
    </Stack>
  )
}
