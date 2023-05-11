import type { PartnerAlarmClock } from "@scp/protocol/typechain-types";
import { writable } from "svelte/store";

export const displayedAlarmId = writable<string | null>(null);
