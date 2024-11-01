import * as React from "react"
import Button from "@mui/joy/Button"
import FormControl from "@mui/joy/FormControl"
import Input from "@mui/joy/Input"
import Stack from "@mui/joy/Stack"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import Typography from "@mui/joy/Typography"
import { SearchEvent, SearchT } from "./pageD3.types"

export default function renderSearch(
  props: SearchT,
  onSearch: (ev: SearchEvent) => void,
) {
  if (!props.showing) return null

  const { label, comment } = props
  return (
    <div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const d = new FormData(event.currentTarget)
          const searchText = (d.get("search") || "") as string
          if (searchText !== "") {
            onSearch({ searchText })
          }
        }}
      >
        <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <Input
              name="search"
              placeholder="Search"
              startDecorator={<SearchRoundedIcon />}
              aria-label={label || "Search"}
            />
          </FormControl>
          <Button type="submit" variant="solid" color="primary">
            {label || "Search"}
          </Button>
        </Stack>
      </form>
      {comment && <Typography level="body-sm">{comment}</Typography>}
    </div>
  )
}
