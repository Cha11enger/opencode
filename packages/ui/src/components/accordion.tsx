import { Accordion as Kobalte } from "@kobalte/core/accordion"
import { createContext, createMemo, createSignal, splitProps, useContext } from "solid-js"
import type { ComponentProps, ParentProps } from "solid-js"

export interface AccordionProps extends ComponentProps<typeof Kobalte> {}
export interface AccordionItemProps extends ComponentProps<typeof Kobalte.Item> {}
export interface AccordionHeaderProps extends ComponentProps<typeof Kobalte.Header> {}
export interface AccordionTriggerProps extends ComponentProps<typeof Kobalte.Trigger> {}
export interface AccordionContentProps extends ComponentProps<typeof Kobalte.Content> {}

type EmbeddedAccordionContextValue = {
  expanded: (value: string) => boolean
  toggle: (value: string) => void
}

const EmbeddedAccordionContext = createContext<EmbeddedAccordionContextValue>()
const EmbeddedAccordionItemContext = createContext<string>()

function isWyzordEmbeddedOpenCode() {
  return (
    typeof window !== "undefined" &&
    Boolean((window as Window & { __WYZORD_OPENCODE_EMBEDDED__?: boolean }).__WYZORD_OPENCODE_EMBEDDED__)
  )
}

function accordionValues(value: string | string[] | undefined | null): string[] {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function AccordionRoot(props: AccordionProps) {
  const [split, rest] = splitProps(props, [
    "class",
    "classList",
    "children",
    "value",
    "defaultValue",
    "onChange",
    "multiple",
    "collapsible",
  ])
  if (isWyzordEmbeddedOpenCode()) {
    const [internalValue, setInternalValue] = createSignal(accordionValues(split.defaultValue))
    const selected = createMemo(() => accordionValues(split.value ?? internalValue()))
    const expanded = (value: string) => selected().includes(value)
    const toggle = (value: string) => {
      const current = selected()
      const isOpen = current.includes(value)
      let next: string[]
      if (split.multiple) next = isOpen ? current.filter((item) => item !== value) : [...current, value]
      else if (isOpen && split.collapsible) next = []
      else next = [value]
      if (split.value === undefined) setInternalValue(next)
      split.onChange?.(next)
    }

    return (
      <EmbeddedAccordionContext.Provider value={{ expanded, toggle }}>
        <div
          {...(rest as ComponentProps<"div">)}
          data-component="accordion"
          classList={{
            ...split.classList,
            [split.class ?? ""]: !!split.class,
          }}
        >
          {split.children}
        </div>
      </EmbeddedAccordionContext.Provider>
    )
  }
  return (
    <Kobalte
      {...rest}
      value={split.value}
      defaultValue={split.defaultValue}
      onChange={split.onChange}
      multiple={split.multiple}
      collapsible={split.collapsible}
      data-component="accordion"
      classList={{
        ...split.classList,
        [split.class ?? ""]: !!split.class,
      }}
    />
  )
}

function AccordionItem(props: AccordionItemProps) {
  const [split, rest] = splitProps(props, ["class", "classList", "children", "value"])
  if (isWyzordEmbeddedOpenCode()) {
    return (
      <EmbeddedAccordionItemContext.Provider value={split.value}>
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
      </EmbeddedAccordionItemContext.Provider>
    )
  }
  return (
    <Kobalte.Item
      {...rest}
      value={split.value}
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
    const context = useContext(EmbeddedAccordionContext)
    const value = useContext(EmbeddedAccordionItemContext)
    const open = createMemo(() => Boolean(value && context?.expanded(value)))
    return (
      <button
        {...(rest as ComponentProps<"button">)}
        type="button"
        data-slot="accordion-trigger"
        data-expanded={open() ? "" : undefined}
        aria-expanded={open()}
        classList={{
          ...split.classList,
          [split.class ?? ""]: !!split.class,
        }}
        onClick={() => value && context?.toggle(value)}
      >
        {split.children}
      </button>
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
    const context = useContext(EmbeddedAccordionContext)
    const value = useContext(EmbeddedAccordionItemContext)
    const open = createMemo(() => Boolean(value && context?.expanded(value)))
    return (
      <div
        {...(rest as ComponentProps<"div">)}
        data-slot="accordion-content"
        data-expanded={open() ? "" : undefined}
        hidden={!open()}
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
