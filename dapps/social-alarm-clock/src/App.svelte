<script lang="ts">
  import "./app.css";

  import { web3Modal } from "./lib/chainClient";
  import { account } from "./lib/chainClient";
  import {
    AlarmState,
    commitmentHub,
    userAlarm,
    userAlarmState,
  } from "./lib/contractInterface";
  import { View, showBackButton, view } from "./lib/appView";
  import { ClockDisplay, shorthandAddress } from "@scp/dapp-lib";
  import { fade } from "svelte/transition";
  import { getOtherPlayer } from "./lib/alarmHelpers";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Web3Status from "./Web3Status.svelte";
  import Welcome from "./Welcome.svelte";
  import PendingAlarms from "./PendingAlarms.svelte";
  import NewAlarm from "./new-alarm/NewAlarm.svelte";
  import { writable } from "svelte/store";

  $: otherPlayer =
    $userAlarm && $account?.address
      ? getOtherPlayer($userAlarm, $account.address)
      : undefined;

  let alarmId: string | null = null;
  $: if ($commitmentHub && $userAlarm && !alarmId) {
    $commitmentHub.commitmentIds($userAlarm.address).then((id) => {
      if (id) alarmId = id.toString();
    });
  }

  type Tab = "alarms" | "new";
  const activeTab = writable<Tab>("alarms");
  $: activeTabStyles = (t: Tab) =>
    t === $activeTab ? " underline underline-offset-4 " : " ";
</script>

<SvelteToast />

<div class="absolute w-full flex justify-center">
  <div class="m-4 pt-2 top-clock px-6 text-center rounded-2xl">
    <div>The Social Alarm Clock</div>
    <div style="font-size:2em">
      <ClockDisplay />
    </div>
  </div>
</div>

<main
  class=" font-jura flex items-center justify-center outline box-border min-h-screen"
  in:fade={{ duration: 500, delay: 500 }}
>
  <div
    class="border-4 border-cyan-600 rounded-3xl bg-trans p-4 w-[580px] h-[320px] flex gap-2 flex-col shadow-neutral-500 main-container-shadow"
  >
    <!-- Main content header -->
    <div class="flex justify-between font-bold align-middle">
      <div class="flex gap-4">
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
    <div class="flex flex-col p-1">
      {#if $activeTab === "alarms"}
        {#if !$userAlarm}
          <div
            class="tracking-tight p-2 text-zinc-400 flex-grow align-middle rounded-2xl"
          >
            You have no active alarms. Create a new alarm or join an existing
            one.
          </div>
        {:else}
          <div>Alarm Card</div>
        {/if}
      {:else if $activeTab === "new"}
        <NewAlarm />
      {/if}
    </div>

    <!-- Your app content goes here
    {#if $view === View.CONNECT_WALLET}
      <div class="welcome">
        <h2>Welcome to the Social Alarm Clock.</h2>
        <p>Connect your wallet to start waking up earlier.</p>
      </div>
    {:else if $view === View.NO_ALARM}
      <div class="new-alarm-button-container">
        <button
          class="new-alarm-button"
          on:click={() => view.changeTo(View.CREATE_ALARM)}>Create Alarm</button
        >
      </div>
      <div style="display:flex; align-items: center;">
        <div class="divider-line" />
      </div>
      <div class="new-alarm-button-container">
        <button
          class="new-alarm-button"
          on:click={() => view.changeTo(View.JOIN_ALARM)}>Join Alarm</button
        >
      </div>
    {:else if $view === View.CREATE_ALARM}
      <CreateNewAlarm />
    {:else if $view === View.JOIN_ALARM}
      <JoinAlarm />
    {:else if $view === View.WAITING_FOR_OTHER_PLAYER}
      {#await alarmId then alarmId}
        {#await otherPlayer then otherPlayer}
          <PendingAlarms items={[{ otherPlayer, id: alarmId }]} />
        {/await}
      {/await}
    {:else if $view === View.ALARM_ACTIVE}
      <ActiveAlarm />
    {/if}  -->
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
    box-shadow: 0px 0px 20px 5px rgba(140, 140, 140, 0.158);
  }

  .bg-trans {
    background: rgba(30, 30, 30, 0.1);
    backdrop-filter: blur(6px);
  }

  .top-clock {
    background: rgba(34, 34, 34, 0.3);
    backdrop-filter: blur(3px);
  }
</style>
