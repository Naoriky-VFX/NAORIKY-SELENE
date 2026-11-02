import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.SELENE_PASSWORD
  const previousLegacyPassword = process.env.SELENE_SERVER_PASSWORD
  const previousValue = process.env.SELENE_SESSION_ENV_TEST
  process.env.SELENE_PASSWORD = "password"
  process.env.SELENE_SERVER_PASSWORD = "legacy"
  process.env.SELENE_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.SELENE_PASSWORD
  else process.env.SELENE_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.SELENE_SERVER_PASSWORD
  else process.env.SELENE_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.SELENE_SESSION_ENV_TEST
  else process.env.SELENE_SESSION_ENV_TEST = previousValue

  expect(environment.SELENE_PASSWORD).toBeUndefined()
  expect(environment.SELENE_SERVER_PASSWORD).toBeUndefined()
  expect(environment.SELENE_SESSION_ENV_TEST).toBe("included")
})
