import { memo, onShowPage, showPage, type PiRegister } from "@pihanga2/core"
import { v4 as uuidv4 } from "uuid"
import {
  AppState,
  CollectionListT,
  COLLECTION_SCHEMA,
  NS_PREFIX,
  CollectionT,
} from "./app.types"
import {
  Card,
  Stack,
  Typography,
  List,
  Item,
  Form,
  Button,
  Input,
} from "@pihanga2/cards"

import { aspects } from "@pihanga2/ivcap"
import { COLLECTION_PATH } from "./app.reducer"

export enum CoLiCard {
  CollectionListPage = "app/collections/page",
  CollectionListCreate = "app/collections/create",
  CollectionList = "app/collections/list",
}

export function registerCollectionList(register: PiRegister): void {
  const ivcapAspect = aspects<AppState>(register)

  register.card(
    CoLiCard.CollectionListPage,
    Stack<AppState>({
      content: [CoLiCard.CollectionListCreate, CoLiCard.CollectionList],
      spacing: 2,
      style: { joy: { p: 3 } },
    }),
  )

  register.card(
    CoLiCard.CollectionListCreate,
    Card({
      content: [
        { content: Typography({ text: "Create New Collection" }) },
        {
          content: Form<AppState>({
            content: [
              Stack({
                content: [
                  Input({
                    name: "name",
                    required: true,
                    placeholder: "... enter collection name",
                    style: { joy: { width: "300px" } },
                  }),
                  Input({
                    name: "description",
                    placeholder: "... enter description",
                    style: { joy: { width: "500px" } },
                  }),
                  Button({
                    label: "Create",
                    isSubmit: true,
                    style: { joy: { width: "auto" } },
                  }),
                ],
                spacing: 2,
                alignItems: "flex-start",
                style: { joy: { p: 3 } },
              }),
            ],
            onSubmit: (_, { formData }, d) => {
              const { name, description } = formData
              ivcapAspect.create(
                {
                  entity: NS_PREFIX + "collection:" + uuidv4(),
                  schema: COLLECTION_SCHEMA,
                  content: { name, description },
                  contentType: "application/json",
                },
                (_, a) => {
                  console.log(">>>", a)
                },
              )
            },
          }),
        },
      ],
    }),
  )

  register.card(
    CoLiCard.CollectionList,
    Card({
      content: [
        { content: Typography({ text: "Collections" }) },
        {
          content: List<AppState>({
            items: memo<CollectionListT | undefined, Item[], AppState, any>(
              (s) => s.collectionList,
              (coll) =>
                (coll?.items || []).map(({ id, name, description }) => ({
                  id,
                  title: `${name} - ${description}`,
                })),
            ),
            onItemClicked: (s, { itemID }, d) =>
              showPage(d, [COLLECTION_PATH, itemID]),
            marker: "disc",
            size: "lg",
            style: {
              joy: { root: { px: { xs: 5, md: 10 } } },
            },
          }),
        },
      ],
    }),
  )

  onShowPage<AppState>(register, (state, _, d) => {
    const path = state.route.path
    if (path.length === 1 && path[0] === COLLECTION_PATH) {
      refreshCollectionList()
      state.activePage = CoLiCard.CollectionListPage
    }
  })

  function refreshCollectionList() {
    ivcapAspect.list(
      {
        schema: COLLECTION_SCHEMA,
        includeContent: true,
      },
      (s, { aspects, nextPage }) => {
        const items = aspects.map(({ entity, content }) => {
          const { name, description } = content as CollectionT
          return { id: entity, name, description } as CollectionT
        })
        s.collectionList = {
          items,
          nextPage,
        }
      },
    )
  }
}
