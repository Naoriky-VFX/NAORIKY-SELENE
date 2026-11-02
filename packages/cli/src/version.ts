import { Option, Schema } from "effect"

declare const SELENE_VERSION: string
declare const SELENE_CHANNEL: string
declare const SELENE_ARTIFACT: string
declare const SELENE_RELEASE_HIGHLIGHTS: string

const version = typeof SELENE_VERSION === "string" ? SELENE_VERSION : "local"
const channel = typeof SELENE_CHANNEL === "string" ? SELENE_CHANNEL : "local"
const artifact = typeof SELENE_ARTIFACT === "string" ? SELENE_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof SELENE_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(SELENE_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as SELENE_VERSION,
  channel as SELENE_CHANNEL,
  artifact as SELENE_ARTIFACT,
  highlights as SELENE_HIGHLIGHTS,
}
export const SELENE_LOCAL = channel === "local"
