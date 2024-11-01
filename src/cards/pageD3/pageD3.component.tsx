import * as React from "react"
import Box from "@mui/joy/Box"
import Stack from "@mui/joy/Stack"
import { Card, PiCardProps } from "@pihanga2/core"

import { PageD3Props, PageD3Events, JyPageD3Style } from "./pageD3.types"
import renderNavbar from "./navBar.component"
import renderHeader from "./header.component"
import renderSearch from "./search.component"

export const PageD3Component = (
  props: PiCardProps<PageD3Props<JyPageD3Style>, PageD3Events>,
): React.ReactNode => {
  const {
    navBar,
    pageHeader,
    search,
    content,
    style,
    onNavLink,
    onSearch,
    onUserLogout,
    cardName,
  } = props

  const outerBox = {
    component: "main",
    sx: {
      // height: "calc(100vh - 55px)", // 55px is the height of the NavBar
      display: "grid",
      // gridTemplateColumns: { xs: 'auto', md: '60% 40%' },
      // gridTemplateRows: "auto 1fr auto",
      ...style?.joy?.outer,
    },
  }
  const innerBox = {
    backgroundColor: "background.surface",
    px: { xs: 2, md: 4 },
    py: 2,
    borderBottom: "1px solid",
    borderColor: "divider",
    // ...style?.joy?.inner,
  }

  function renderInnerBox() {
    if (!pageHeader && !search) return null

    return (
      <Stack sx={innerBox} data-pihanga={`${cardName}-inner`}>
        <React.Fragment key="header">
          {pageHeader && renderHeader(pageHeader)}
        </React.Fragment>
        <React.Fragment key="search">
          {search && renderSearch(search, onSearch)}
        </React.Fragment>
      </Stack>
    )
  }

  return (
    <Window>
      {renderNavbar(navBar, onNavLink, onUserLogout)}
      <Box component="main" sx={outerBox.sx} data-pihanga={`${cardName}-outer`}>
        {renderInnerBox()}
        <Card cardName={content} parentCard="" />
      </Box>
    </Window>
  )
}

function Window(props: { children?: React.ReactNode[] }) {
  const windowP = {
    cardType: "joy/window",
    disableTransitionOnChange: true,
  }

  return (
    <Card cardName={windowP} parentCard={""}>
      {props.children}
    </Card>
  )
}
