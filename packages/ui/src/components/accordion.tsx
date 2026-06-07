import { Accordion as Kobalte } from "@kobalte/core/accordion"
import { splitProps } from "solid-js"
import type { ComponentProps, ParentProps } from "solid-js"

export interface AccordionProps extends ComponentProps<typeof Kobalte> {}
export interface AccordionItemProps extends ComponentProps<typeof Kobalte.Item> {}
export interface AccordionHeaderProps extends ComponentProps<typeof Kobalte.Header> {}
export interface AccordionTriggerProps extends ComponentProps<typeof Kobalte.Trigger> {}
export interface AccordionContentProps extends ComponentProps<typeof Kobalte.Content> {}

function isWyzordEmbeddedOpenCode() {
  return (
    typeof window !== "undefined" &&
    Boolean((window as Window & { __WYZORD_OPENCODE_EMBEDDED__?: boolean }).__WYZORD_OPENCODE_EMBEDDED__)
  )
}

function AccordionRoot(props: AccordionProps) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        data-component="accordion"
        data-embedded-open=""
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
      >
        {split.children}
      </div>
    )
  }
  return (
    <Kobalte
      {...rest}
      data-component="accordion"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    />
  )
}

function AccordionItem(props: AccordionItemProps) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        {...(rest as ComponentProps<"div">)}
        data-slot="accordion-item"
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
      >
        {split.children}
      </div>
    )
  }
  return (
    <Kobalte.Item
      {...rest}
      data-slot="accordion-item"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    />
  )
}

function AccordionHeader(props: ParentProps<AccordionHeaderProps>) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        {...(rest as ComponentProps<"div">)}
        data-slot="accordion-header"
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
      >
        {split.children}
      </div>
    )
  }
  return (
    <Kobalte.Header
      {...rest}
      data-slot="accordion-header"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    >
      {split.children}
    </Kobalte.Header>
  )
}

function AccordionTrigger(props: ParentProps<AccordionTriggerProps>) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        {...(rest as ComponentProps<"div">)}
        data-slot="accordion-trigger"
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
      >
        {split.children}
      </div>
    )
  }
  return (
    <Kobalte.Trigger
      {...rest}
      data-slot="accordion-trigger"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    >
      {split.children}
    </Kobalte.Trigger>
  )
}

function AccordionContent(props: ParentProps<AccordionContentProps>) {
  const [split, rest] = splitProps(props, ["class", "classList", "children"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <div
        {...(rest as ComponentProps<"div">)}
        data-slot="accordion-content"
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
      >
        {split.children}
      </div>
    )
  }
  return (
    <Kobalte.Content
      {...rest}
      data-slot="accordion-content"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    >
      {split.children}
    </Kobalte.Content>
  )
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})
