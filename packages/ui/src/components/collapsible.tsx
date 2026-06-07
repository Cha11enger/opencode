import { Collapsible as Kobalte, CollapsibleRootProps } from "@kobalte/core/collapsible"
import { ComponentProps, ParentProps, splitProps } from "solid-js"
import { Icon } from "./icon"

export interface CollapsibleProps extends ParentProps<CollapsibleRootProps> {
  class?: string
  classList?: ComponentProps<"div">["classList"]
  variant?: "normal" | "ghost"
}

function isWyzordEmbeddedOpenCode() {
  return (
    typeof window !== "undefined" &&
    Boolean((window as Window & { __WYZORD_OPENCODE_EMBEDDED__?: boolean }).__WYZORD_OPENCODE_EMBEDDED__)
  )
}

function CollapsibleRoot(props: CollapsibleProps) {
  const [local, others] = splitProps(props, ["class", "classList", "variant", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        data-component="collapsible"
        data-variant={local.variant || "normal"}
        data-embedded-open=""
        classList={{
          ...local.classList,
          [local.class ?? ""]: !!local.class,
        }}
      >
        {local.children}
      </div>
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
    const [local, others] = splitProps(props as ComponentProps<"div">, ["children"])
    return <div data-slot="collapsible-trigger" {...others}>{local.children}</div>
  }
  return <Kobalte.Trigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent(props: ComponentProps<typeof Kobalte.Content>) {
  if (isWyzordEmbeddedOpenCode()) {
    const [local, others] = splitProps(props as ComponentProps<"div">, ["children"])
    return <div data-slot="collapsible-content" {...others}>{local.children}</div>
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
