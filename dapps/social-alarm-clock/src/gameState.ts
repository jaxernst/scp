import { writable } from "svelte/store"

 enum View {
  CONNECT_WALLET,
  NO_ACTIVE_GAME,
  CREATE_ALARM,
  JOIN_ALARM,
  ALARM_ACTIVE
}

export const gameActive = writable(false)