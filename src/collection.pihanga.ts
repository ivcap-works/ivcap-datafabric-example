import { artifacts, Aspect, aspects } from "@pihanga2/ivcap"
import { v4 as uuidv4 } from "uuid"

import {
  AppState,
  COLLECTION_ITEM_SCHEMA,
  COLLECTION_SCHEMA,
  CollectionItemStateT,
  CollectionItemT,
  NS_PREFIX,
} from "./app.types"
import {
  memo,
  onShowPage,
  PiCardRef,
  PiRegister,
  showPage,
} from "@pihanga2/core"
import {
  Button,
  DecoratorE,
  FileDrop,
  FileDroppedEvent,
  get_last_dropped,
  ImageViewer,
  Stack,
  Table,
  TableColumnTypeE,
  Typography,
} from "@pihanga2/cards"
import { Icon } from "./app.icons"
import { COLLECTION_PATH } from "./app.reducer"

export enum CoCard {
  Page = "app/collection/page",
  List = "app/collection/list",
  Detail = "app/collection/detail",
}

export function registerCollection(register: PiRegister): void {
  const ivcapAspect = aspects<AppState, CollectionItemT>(register)
  const ivcapArtifact = artifacts<AppState>(register)

  register.card(
    CoCard.Page,
    Stack<AppState>({
      content: memo<string, PiCardRef[], AppState, any>(
        (s) => s.collection?.name || "???",
        (name) => [
          Button<AppState>({
            label: "Back",
            variant: "plain",
            startDecorator: { type: DecoratorE.Icon, icon: Icon.Back },
            onClicked: (s, _, d) => showPage(d, []),
          }),
          Typography({ text: `Collection: ${name}`, level: "h3" }),
          FileDrop({
            title: "Click or drop an image right here",
            onFileDropped,
          }),
          CoCard.List,
        ],
      ),
      spacing: 2,
      style: { joy: { p: 3 } },
    }),
  )

  register.card(
    CoCard.List,
    Table<CollectionItemT, AppState>()({
      columns: [
        {
          type: TableColumnTypeE.String,
          label: "id_short",
          title: "Id",
          columnWidth: "7em",
        },
        {
          type: TableColumnTypeE.String,
          label: "name",
          title: "Name",
          // sortable: true,
        },
        {
          type: TableColumnTypeE.String,
          label: "size",
          title: "Size",
          // sortable: true,
        },
        {
          type: TableColumnTypeE.String,
          label: "contentType",
          title: "Content Type",
          // sortable: true,
        },
      ],
      data: memo<CollectionItemStateT[], any, AppState, any>(
        (s) => s.collection?.items || [],
        (items) =>
          items.map((el) => {
            const { id, id_short, name } = getItemName(el)
            return {
              id,
              data: { ...el, id_short, name },
              detailCard: CoCard.Detail,
            }
          }),
      ),
      hasDetails: true,
      manageDetails: true,
    }),
  )

  register.card(
    CoCard.Detail,
    ImageViewer({
      imgURL: (_, { ctxtProps }) => {
        const d = ctxtProps.row.data as CollectionItemStateT
        if (d.data) {
          return d.data
        }

        ivcapArtifact.getData({ id: d.artifactURN }, (s, { data }) => {
          if (s.collection) {
            s.collection.items = s.collection.items.map((c) => {
              if (c.artifactURN === d.artifactURN) {
                return { ...c, data }
              }
              return c
            })
          }
        })
      },
      caption: (_, { ctxtProps }) => ctxtProps.row.data.name,
      maxWidth: "50vw",
    }),
  )

  function onFileDropped(s: AppState, { name }: FileDroppedEvent) {
    const file = get_last_dropped(name)
    if (!file) return

    const collectionURN = s.route.path[1]
    ivcapArtifact.create({ file, name }, (_, a) => {
      const { artifactURN, size, contentType } = a
      const content = { name, artifactURN, collectionURN, size, contentType }
      ivcapAspect.create(
        {
          entity: NS_PREFIX + "collection-item:" + uuidv4(),
          schema: COLLECTION_ITEM_SCHEMA,
          content,
          contentType: "application/json",
        },
        (s, { aspectID }) => {
          if (s.collection) {
            s.collection.items.push({
              id: aspectID,
              ...content,
            })
          }
        },
      )
    })
  }

  onShowPage<AppState>(register, (state, _, d) => {
    const path = state.route.path
    if (path.length === 2 && path[0] === COLLECTION_PATH) {
      refreshCollection(path[1])
      state.activePage = CoCard.Page
    }
  })

  function refreshCollection(id: string) {
    // fetch all items in the collection
    ivcapAspect.list(
      {
        schema: COLLECTION_ITEM_SCHEMA,
        filter: `collectionURN~=${id}`,
        includeContent: true,
      },
      (s, { aspects }) => {
        const items = aspects.map(({ entity, content }) => {
          const { name, artifactURN, contentType, size } = content as any
          return {
            id: entity,
            name,
            collectionURN: id,
            artifactURN,
            contentType,
            size,
          } as CollectionItemStateT
        })
        s.collection = {
          ...s.collection,
          id,
          items,
        }
      },
    )
    // refresh info about the collection (e.g. name) itself
    ivcapAspect.list(
      {
        entity: id,
        schema: COLLECTION_SCHEMA,
        includeContent: true,
      },
      (s, { aspects }) => {
        const name = aspects[0]?.content?.name || "???"
        if (s.collection) {
          s.collection = { ...s.collection, name }
        }
      },
    )
  }
}

function getItemName(el: CollectionItemStateT): {
  id: string
  id_short: string
  name: string
} {
  const id = el.id.split(":")[3]
  const id_short = id.substring(id.length - 6)
  let name = el.name.startsWith("urn:ivcap") ? id_short : el.name
  if (name.startsWith("http")) {
    // should no longer happen
    name = id_short
  }
  return { id, id_short, name }
}
