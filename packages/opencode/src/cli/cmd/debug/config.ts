import { EOL } from "os"
import { Effect } from "effect"
import { Config } from "@/config/config"
import { effectCmd } from "../../effect-cmd"

const SECRET_KEY = /(api[-_]?key|token|secret|password|authorization|bearer|credential)/i

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact)
  if (!value || typeof value !== "object") return value
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, SECRET_KEY.test(key) ? "[redacted]" : redact(item)]),
  )
}

export const ConfigCommand = effectCmd({
  command: "config",
  describe: "show resolved configuration",
  builder: (yargs) => yargs,
  handler: Effect.fn("Cli.debug.config")(function* () {
    const config = yield* Config.Service.use((cfg) => cfg.get())
    process.stdout.write(JSON.stringify(redact(config), null, 2) + EOL)
  }),
})
