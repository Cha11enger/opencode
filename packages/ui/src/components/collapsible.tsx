import { Collapsible as Kobalte, CollapsibleRootProps } from "@kobalte/core/collapsible"
import { ComponentProps, ParentProps, createContext, createMemo, createSignal, splitProps, useContext } from "solid-js"
import { Icon } from "./icon"

export interface CollapsibleProps extends ParentProps<CollapsibleRootProps> {
  class?: string
  classList?: ComponentProps<"div">["classList"]
  variant?: "normal" | "ghost"
}

type EmbeddedCollapsibleContextValue = {
  open: () => boolean
  disabled: () => boolean
  toggle: () => void
}

const EmbeddedCollapsibleContext = createContext<EmbeddedCollapsibleContextValue>()

function isWyzordEmbeddedOpenCode() {
  return (
    typeof window !== "undefined" &&
    Boolean((window as Window & { __WYZORD_OPENCODE_EMBEDDED__?: boolean }).__WYZORD_OPENCODE_EMBEDDED__)
  )
}

function CollapsibleRoot(props: CollapsibleProps) {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "variant",
    "children",
    "open",
    "defaultOpen",
    "onOpenChange",
    "disabled",
  ])
  if (isWyzordEmbeddedOpenCode()) {
    const [internalOpen, setInternalOpen] = createSignal(Boolean(local.defaultOpen))
    const open = createMemo(() => (typeof local.open === "boolean" ? local.open : internalOpen()))
    const disabled = createMemo(() => Boolean(local.disabled))
    const toggle = () => {
      if (disabled()) return
      const next = !open()
      if (typeof local.open !== "boolean") setInternalOpen(next)
      local.onOpenChange?.(next)
    }

    return (
      <EmbeddedCollapsibleContext.Provider value={{ open, disabled, toggle }}>
        <div
          {...(others as ComponentProps<"div">)}
          data-component="collapsible"
          data-variant={local.variant || "normal"}
          data-expanded={open() ? "" : undefined}
          data-closed={!open() ? "" : undefined}
          classList={{
            ...local.classList,
            [local.class ?? ""]: !!local.class,
          }}
        >
          {local.children}
        </div>
      </EmbeddedCollapsibleContext.Provider>
    )
  }
  return (
    <Kobalte
      data-component="collapsible"
      data-variant={local.variant || "normal"}
      classList={{
        ...local.classList,
        [local.class ?? ""]: !!local.class,
      }}
      {...others}
    />
  )
}

function CollapsibleTrigger(props: ComponentProps<typeof Kobalte.Trigger>) {
  if (isWyzordEmbeddedOpenCode()) {
    const context = useContext(EmbeddedCollapsibleContext)
    const [local, others] = splitProps(props as ComponentProps<"button">, ["children", "onClick", "disabled"])
    return (
      <button
        {...others}
        type="button"
        data-slot="collapsible-trigger"
        data-expanded={context?.open() ? "" : undefined}
        aria-expanded={context?.open() ?? false}
        disabled={local.disabled || context?.disabled()}
        onClick={(event) => {
          if (typeof local.onClick === "function") local.onClick(event)
          if (!event.defaultPrevented) context?.toggle()
        }}
      >
        {local.children}
      </button>
    )
  }
  return <Kobalte.Trigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent(props: ComponentProps<typeof Kobalte.Content>) {
  if (isWyzordEmbeddedOpenCode()) {
    const context = useContext(EmbeddedCollapsibleContext)
    const [local, others] = splitProps(props as ComponentProps<"div">, ["children"])
    return (
      <div
        {...others}
        data-slot="collapsible-content"
        data-expanded={context?.open() ? "" : undefined}
        hidden={!context?.open()}
      >
        {local.children}
      </div>
    )
  }
  return <Kobalte.Content data-slot="collapsible-content" {...props} />
}

function CollapsibleArrow(props?: ComponentProps<"div">) {
  return (
    <div data-slot="collapsible-arrow" {...(props || {})}>
      <span data-slot="collapsible-arrow-icon">
        <Icon name="chevron-down" size="small" />
      </span>
    </div>
  )
}

export const Collapsible = Object.assign(CollapsibleRoot, {
  Arrow: CollapsibleArrow,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})
