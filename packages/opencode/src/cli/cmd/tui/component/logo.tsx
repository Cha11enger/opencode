import { TextAttributes, type RGBA } from "@opentui/core"
import { For } from "solid-js"
import { useTheme, tint } from "@tui/context/theme"

export type LogoShape = {
  left: string[]
  right: string[]
}

const WYZORD_WORDMARK = [
  "W   W Y   Y ZZZZZ  OOO  RRRR  DDDD",
  "W   W  Y Y     Z  O   O R   R D   D",
  "W W W   Y     Z   O   O RRRR  D   D",
  "WW WW   Y    Z    O   O R  R  D   D",
  "W   W   Y   ZZZZZ  OOO  R   R DDDD",
]

function lineInk(index: number, total: number, ink: RGBA | undefined, theme: ReturnType<typeof useTheme>["theme"]) {
  if (ink) return ink
  const ratio = total <= 1 ? 0 : index / (total - 1)
  return tint(theme.primary, theme.text, 0.24 + ratio * 0.5)
}

export function Logo(_props: { shape?: LogoShape; ink?: RGBA; idle?: boolean } = {}) {
  const { theme } = useTheme()

  return (
    <box flexDirection="column" alignItems="center" gap={1}>
      <For each={WYZORD_WORDMARK}>
        {(line, index) => (
          <text
            fg={lineInk(index(), WYZORD_WORDMARK.length, _props.ink, theme)}
            attributes={TextAttributes.BOLD}
            selectable={false}
          >
            {line}
          </text>
        )}
      </For>
      <box flexDirection="row" gap={1}>
        <text fg={theme.textMuted} selectable={false}>
          WYZORD
        </text>
        <text fg={theme.primary} attributes={TextAttributes.BOLD} selectable={false}>
          CODE
        </text>
      </box>
    </box>
  )
}

export function GoLogo() {
  return <Logo idle />
}
