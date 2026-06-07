import { Index, createMemo } from "solid-js"
import { AnimatedCountLabel } from "./tool-count-label"

export type CountItem = {
  key: string
  count: number
  one: string
  other: string
}

function embeddedLabel(item: CountItem) {
  const count = Math.max(0, Math.round(item.count))
  const template = count === 1 ? item.one : item.other
  if (/{{\s*count\s*}}/.test(template)) return template.replace(/{{\s*count\s*}}/g, String(count)).trim()

  const translated = template.trim()
  if (translated && !/^(one|other)$/i.test(translated)) return `${count} ${translated}`

  const noun =
    item.key === "read"
      ? count === 1
        ? "file"
        : "files"
      : item.key === "search"
        ? count === 1
          ? "search"
          : "searches"
        : count === 1
          ? "list"
          : "lists"
  return `${count} ${noun}`
}

export function AnimatedCountList(props: { items: CountItem[]; fallback?: string; class?: string }) {
  const visible = createMemo(() => props.items.filter((item) => item.count > 0))
  const fallback = createMemo(() => props.fallback ?? "")
  const showEmpty = createMemo(() => visible().length === 0 && fallback().length > 0)
  const embedded = () =>
    typeof window !== "undefined" &&
    Boolean((window as Window & { __WYZORD_OPENCODE_EMBEDDED__?: boolean }).__WYZORD_OPENCODE_EMBEDDED__)

  if (embedded()) {
    return (
      <span data-component="tool-count-summary" class={props.class}>
        {visible().map(embeddedLabel).join(", ") || fallback()}
      </span>
    )
  }

  return (
    <span data-component="tool-count-summary" class={props.class}>
      <span data-slot="tool-count-summary-empty" data-active={showEmpty() ? "true" : "false"}>
        <span data-slot="tool-count-summary-empty-inner">{fallback()}</span>
      </span>

      <Index each={props.items}>
        {(item, index) => {
          const active = createMemo(() => item().count > 0)
          const hasPrev = createMemo(() => {
            for (let i = index - 1; i >= 0; i--) {
              if (props.items[i].count > 0) return true
            }
            return false
          })

          return (
            <>
              <span data-slot="tool-count-summary-prefix" data-active={active() && hasPrev() ? "true" : "false"}>
                ,
              </span>
              <span data-slot="tool-count-summary-item" data-active={active() ? "true" : "false"}>
                <span data-slot="tool-count-summary-item-inner">
                  <AnimatedCountLabel
                    one={item().one}
                    other={item().other}
                    count={Math.max(0, Math.round(item().count))}
                  />
                </span>
              </span>
            </>
          )
        }}
      </Index>
    </span>
  )
}
