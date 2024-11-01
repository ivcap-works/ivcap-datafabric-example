import { PiCardDef, memo, showPage, type PiRegister } from "@pihanga2/core"

import {
  AgentT,
  AppState,
  CrewTemplateT,
  PrepareOrderT,
  TaskT,
} from "./app.types"
import {
  Button,
  Card,
  Form,
  FormInput,
  Link,
  Stack,
  Typography,
  ImageViewer,
  MarkdownViewer,
} from "@pihanga2/cards"

import { AppCard } from "./app.types"
import { HeaderT } from "./cards/pageD3/pageD3.types"
import { createOrderCrewAction } from "./app.reducer"

export function initTemplatePages(register: PiRegister): void {
  register.card(
    AppCard.TemplateList,
    Stack<AppState>({
      content: memo<{ [k: string]: CrewTemplateT }, PiCardDef[], AppState, any>(
        (s) => s.templates,
        (templates) =>
          Object.values(templates)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(template_card),
      ),
      spacing: 2,
      style: {
        joy: { overflow: "auto", px: { xs: 2, md: 4 }, py: 2, minHeight: 0 },
      },
    }),
  )

  function template_card(t: CrewTemplateT) {
    const rt = Link({
      // text: t.name,
      // level: "title-md",
      overlay: true,
      noWrap: true,
      underline: "none",
      childCard: Stack<AppState>({
        content: [
          ImageViewer({
            imgURL: `/icons/${t.id.split(":")[4]}.png`,
            caption: "thumbnail for service",
            minWidth: 80,
          }),
          Stack<AppState>({
            content: [
              Typography({
                text: t.name,
                level: "title-md",
                // noWrap: true,
                textAlign: "left",
              }),
              Typography({
                text: t.summary,
                level: "body-sm",
                textAlign: "left",
                // noWrap: true,
              }),
            ],
          }),
        ],
        direction: "row",
        spacing: 2,
        // alignItems: "flex-start",
      }),
      onClicked: (s, a, d) => {
        showPage(d, ["templates", t.id])
        return s
      },
    })
    // const gt = Typography({ text: goal, noWrap: false })
    return Card({
      content: [{ content: rt }],
      variant: "soft",
      shadowSize: "lg",
    })
  }

  register.card(
    AppCard.TemplateDetail,
    Stack<AppState>({
      content: memo<PrepareOrderT | undefined, PiCardDef[], AppState, any>(
        (s) => s.prepareOrder,
        (p) => {
          if (!p) return []

          const template = p.template
          const placeholders = template.placeholders || []
          const formatString = (s: string) => {
            return placeholders.reduce((s2, k) => {
              const v = p.parameters[k]
              const r = v === "" ? `_${k}_` : `**${v}**`
              return s2.replaceAll(`{${k}}`, r)
            }, s)
          }

          const sc = submitCard(p)
          const ac = Object.values(template.agents).map((a) =>
            agentCard(a, formatString),
          )
          const tc = template.tasks.map((t) =>
            taskCard(t, template, formatString),
          )
          const cards = [sc, ...ac, ...tc]
          return cards
        },
      ),
      spacing: 2,
      style: {
        joy: { overflow: "auto", px: { xs: 2, md: 4 }, py: 2, minHeight: 0 },
      },
    }),
  )

  function submitCard(orderPage: PrepareOrderT): PiCardDef {
    const template = orderPage.template
    const fc: PiCardDef[] = [
      ...template.placeholders
        .toSorted((a, b) => b.localeCompare(a))
        .map((p) =>
          FormInput<AppState>({
            name: p,
            label: toLabel(p),
            defaultValue: orderPage.parameters[p],
            //helperText: "help",
            reportChange: true,
            throttleWait: 1000,
            onChange: (s, { value }) => {
              s.prepareOrder!.parameters[p] = value
              return s
            },
          }),
        ),
      Button<AppState>({
        label: "Submit Order",
        isDisabled: (s) =>
          Object.values(s.prepareOrder?.parameters || {}).findIndex(
            (el) => el === "",
          ) !== -1,
        isLoading: (s) => s.prepareOrder?.orderPending,
        isSubmit: true,
      }),
    ]

    const s = Form<AppState>({
      content: [
        Stack({
          content: fc,
          spacing: 2,
        }),
      ],
      onSubmitMapper: (a) =>
        createOrderCrewAction({
          crewID: orderPage.id,
          parameters: a.formData,
        }),
    })

    return Card({
      content: [{ content: s }],
      variant: "plain",
    })
  }

  function agentCard(agent: AgentT, fs: (s: string) => string): PiCardDef {
    const source = [
      `### ${agent.role}`,
      `__Goal:__ ${fs(agent.goal)}`,
      `__Backstory:__ ${fs(agent.backstory)}`,
    ].join("\n\n")
    return markdownCard(source)
  }

  function taskCard(
    task: TaskT,
    template: CrewTemplateT,
    fs: (s: string) => string,
  ): PiCardDef {
    const agent = template.agents[task.agent]
    let source = [
      `### Task for ${agent.role}`,
      fs(task.description),
      `__Expected Output:__ ${fs(task.expected_output)}`,
    ]
    if (task.tools && task.tools.length > 0) {
      source.push(
        [
          "__Tools Available:__",
          ...task.tools.map((t) => `* ${t.name || t.id}`),
        ].join("\n"),
      )
    }
    return markdownCard(source.join("\n\n"))
  }

  function markdownCard(source: string): PiCardDef {
    return Card({
      content: [{ content: MarkdownViewer({ source: () => source }) }],
      variant: "soft",
    })
  }
}

// export function getTemplateFromPath(s: AppState): CrewTemplateT | undefined {
//   const path = s.route.path
//   if (path.length === 2 && path[0] === "templates") {
//     return s.templates?.find((t) => t.id === path[1])
//   }
// }

export function templatePageHeader(s: AppState): HeaderT | undefined {
  if (s.activePage === AppCard.TemplateList) {
    return {
      title: "Crews",
      subTitle: "A list of crews to get you started",
    }
  }
  if (s.activePage === AppCard.TemplateDetail) {
    if (s.prepareOrder) {
      return { title: s.prepareOrder.template.name }
    } else {
      return { title: "Unknown" }
    }
  }
}

function toLabel(s: string): string {
  return s
    .split("_")
    .map((s) => {
      return s[0].toUpperCase() + s.slice(1)
    })
    .join(" ")
}
