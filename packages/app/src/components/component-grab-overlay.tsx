import { createSignal, For, onCleanup, onMount, Show } from "solid-js"

const MARKER_SELECTOR = [
  "[data-component]",
  "[data-slot]",
  "[data-page]",
  "[data-timeline-row]",
  "[data-session-title]",
].join(",")

type GrabMarker = {
  kind: string
  value: string
}

type GrabTarget = {
  rect: DOMRect
  label: string
  selector: string
  path: GrabMarker[]
}

function markerForElement(element: Element): GrabMarker | undefined {
  for (const name of ["component", "slot", "page", "timeline-row"]) {
    const value = element.getAttribute(`data-${name}`)
    if (value) return { kind: name, value }
  }
  if (element.hasAttribute("data-session-title")) return { kind: "session-title", value: "true" }
}

function cssSelector(marker: GrabMarker) {
  if (marker.kind === "session-title") return "[data-session-title]"
  return `[data-${marker.kind}="${CSS.escape(marker.value)}"]`
}

function collectMarkerPath(element: Element) {
  const path: GrabMarker[] = []
  let current: Element | null = element

  while (current && current !== document.body && path.length < 6) {
    const marker = markerForElement(current)
    if (marker) path.unshift(marker)
    current = current.parentElement
  }

  return path
}

function targetFromEventTarget(target: EventTarget | null): GrabTarget | undefined {
  if (!(target instanceof Element)) return
  if (target.closest("[data-component-grab-overlay]")) return

  const element = target.closest(MARKER_SELECTOR)
  if (!(element instanceof HTMLElement)) return

  const marker = markerForElement(element)
  if (!marker) return

  const path = collectMarkerPath(element)
  return {
    rect: element.getBoundingClientRect(),
    label: `${marker.kind}: ${marker.value}`,
    selector: cssSelector(marker),
    path,
  }
}

function copyTarget(target: GrabTarget) {
  const lines = [
    target.label,
    target.selector,
    target.path.map(cssSelector).join(" > "),
  ].filter(Boolean)

  void navigator.clipboard?.writeText(lines.join("\n"))
}

export function ComponentGrabOverlay() {
  const [enabled, setEnabled] = createSignal(false)
  const [target, setTarget] = createSignal<GrabTarget>()
  const [copiedLabel, setCopiedLabel] = createSignal("")

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const startsEnabled =
      params.has("componentGrab") ||
      params.has("grab") ||
      params.has("reactGrab") ||
      localStorage.getItem("opencode.componentGrab") === "on"

    setEnabled(startsEnabled)

    const toggle = () => {
      setEnabled((value) => {
        const next = !value
        localStorage.setItem("opencode.componentGrab", next ? "on" : "off")
        if (!next) setTarget(undefined)
        return next
      })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "g")) return
      event.preventDefault()
      toggle()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled()) return
      setTarget(targetFromEventTarget(event.target))
    }

    const onScrollOrResize = () => {
      setTarget((current) => current ? { ...current, rect: current.rect } : current)
    }

    const onClick = (event: MouseEvent) => {
      if (!enabled()) return
      const current = target()
      if (!current) return

      event.preventDefault()
      event.stopPropagation()
      copyTarget(current)
      setCopiedLabel(current.label)
      window.setTimeout(() => setCopiedLabel(""), 1400)
    }

    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("click", onClick, true)
    window.addEventListener("scroll", onScrollOrResize, true)
    window.addEventListener("resize", onScrollOrResize)

    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("pointermove", onPointerMove, true)
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("scroll", onScrollOrResize, true)
      window.removeEventListener("resize", onScrollOrResize)
    })
  })

  return (
    <div data-component-grab-overlay data-state={enabled() ? "enabled" : "disabled"}>
      <button
        type="button"
        data-slot="component-grab-toggle"
        onClick={() =>
          setEnabled((value) => {
            const next = !value
            localStorage.setItem("opencode.componentGrab", next ? "on" : "off")
            if (!next) setTarget(undefined)
            return next
          })
        }
      >
        <span>{enabled() ? "React Grab on" : "React Grab"}</span>
        <kbd>Ctrl Shift G</kbd>
      </button>

      <Show when={enabled() && target()}>
        {(current) => (
          <>
            <div
              data-slot="component-grab-frame"
              style={{
                left: `${current().rect.left}px`,
                top: `${current().rect.top}px`,
                width: `${current().rect.width}px`,
                height: `${current().rect.height}px`,
              }}
            />
            <div
              data-slot="component-grab-popover"
              style={{
                left: `${Math.min(current().rect.left, window.innerWidth - 320)}px`,
                top: `${Math.min(current().rect.bottom + 8, window.innerHeight - 150)}px`,
              }}
            >
              <div data-slot="component-grab-label">{copiedLabel() ? "Copied" : current().label}</div>
              <div data-slot="component-grab-selector">{current().selector}</div>
              <div data-slot="component-grab-path">
                <For each={current().path}>{(marker) => <span>{marker.kind}:{marker.value}</span>}</For>
              </div>
            </div>
          </>
        )}
      </Show>
    </div>
  )
}
