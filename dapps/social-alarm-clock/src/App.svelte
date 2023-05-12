<script lang="ts">
  import "./app.css";
  import { userAlarms } from "./lib/contractInterface";
  import { ClockDisplay } from "@scp/dapp-lib";
  import { fade } from "svelte/transition";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Web3Status from "./Web3Status.svelte";
  import NewAlarm from "./new-alarm/NewAlarm.svelte";
  import AlarmsSidebar from "./alarms/AlarmsSidebar.svelte";
  import { writable } from "svelte/store";
  import ActiveAlarm from "./alarms/ActiveAlarm.svelte";
  import { displayedAlarmId } from "./alarms/displayedAlarm";
  import AlarmDetail from "./alarms/AlarmDetail.svelte";

  type Tab = "alarms" | "new";
  const activeTab = writable<Tab>("alarms");
  $: activeTabStyles = (t: Tab) =>
    t === $activeTab ? " underline underline-offset-4 " : " ";

  $: numUserAlarms = Object.keys($userAlarms ?? {}).length;
</script>

<SvelteToast />

<div class="absolute flex w-full justify-center">
  <div
    class="top-clock m-4 flex items-center gap-4 rounded-2xl px-6 py-2 text-center"
  >
    <div class="text-lg font-bold">The Social Alarm Clock</div>
    |
    <div style="font-size:1.5em" class="pt-1">
      <ClockDisplay />
    </div>
  </div>
</div>

<main
  class=" font-jura box-border flex min-h-screen items-center justify-center outline"
  in:fade={{ duration: 500, delay: 500 }}
>
  <div
    class="bg-trans main-container-shadow flex h-[320px] w-[580px] flex-col gap-2 rounded-3xl border-4 border-cyan-600 p-3 text-zinc-400 shadow-neutral-500"
  >
    <!-- Main content header -->
    <div class="flex justify-between align-middle font-bold">
      <div class="flex gap-4 rounded-xl py-1">
        <button
          class={activeTabStyles("alarms")}
          on:click={() => activeTab.set("alarms")}>ALARMS</button
        >
        <button
          class={activeTabStyles("new")}
          on:click={() => activeTab.set("new")}>NEW</button
        >
      </div>
      <div>
        <Web3Status />
      </div>
    </div>

    <!-- Main content -->
    {#if $activeTab === "alarms"}
      {#if numUserAlarms === 0}
        <div
          class="flex-grow rounded-2xl p-2 align-middle tracking-tight text-zinc-400"
        >
          You have no active alarms. Create a new alarm or join an existing one.
        </div>
      {:else}
        <div class="alarms-container-grid flex-grow gap-3 text-zinc-400">
          <AlarmsSidebar />
          <div class="bg-transparent-grey rounded-2xl">
            {#if $displayedAlarmId && $userAlarms[Number($displayedAlarmId)]}
              <AlarmDetail alarm={$userAlarms[Number($displayedAlarmId)]} />
            {/if}
          </div>
        </div>
      {/if}
    {:else if $activeTab === "new"}
      <NewAlarm />
    {/if}
  </div>
</main>

<style>
  .radial-background {
    background: radial-gradient(
      circle,
      rgba(26, 26, 26, 1) 0%,
      rgba(31, 31, 31, 1) 100%
    );
  }

  .main-container-shadow {
    box-shadow: 0px 0px 15px 5px rgba(140, 140, 140, 0.12);
  }

  .bg-trans {
    background: rgba(30, 30, 30, 0.1);
    backdrop-filter: blur(6px);
  }

  .top-clock {
    background: rgba(37, 37, 37, 0.3);
    backdrop-filter: blur(3px);
  }

  .alarms-container-grid {
    display: grid;
    grid-template-columns: 1fr 60%;
  }
</style>
