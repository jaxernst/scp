<script>
  import { isAddress } from "ethers/lib/utils.js";
  import { getOtherPlayer } from "../lib/alarmHelpers";
  import FormCard from "./FormCard.svelte";
  import { creationParams, otherPlayer } from "./alarmCreation";
  import SelectPartner from "./form-cards/SelectPartner.svelte";
  import ToggleLetter from "../ToggleLetter.svelte";
  const cardNumberStyle =
    "absolute top-0 left-[5px] text-s text-bold text-zinc-500";
  const optionCardStyle =
    " p-1 bg-zinc-700 h-[85px] rounded-xl w-[110px] relative transition focus:scale-110 focus:border-zinc-200 focus:border ";

  let focusCard = 1;
</script>

<div class="flex flex-col gap-4 justify-center">
  <div>
    <h3 class="py-2">Join an Alarm</h3>
    <div class=" h-[30px] rounded-xl px-3 flex gap-2">
      <input
        type="text"
        class=" flex-grow h-full bg-zinc-700 rounded-xl px-2 placeholder-zinc-500 text-zinc-300"
        placeholder="Enter alarm id to join"
      />
      <button
        class="px-4 text-bold bg-zinc-800 text-bold rounded-xl text-cyan-400"
        >JOIN</button
      >
    </div>
  </div>

  <div class="">
    <h3 class="pt-2">Create an Alarm</h3>
    <div
      class="flex gap-3 px-3 py-2 text-zinc-300 overflow-x-auto no-scrollbar"
    >
      <FormCard
        itemNumber={1}
        emptyHeader="Select Partner"
        filledHeader="Partner"
        input={$creationParams.otherPlayer}
        inputValid={isAddress}
      >
        <input
          class="bg-transparent outline-none text-center w-min"
          type="text"
          placeholder="Enter address or ENS"
          bind:value={$creationParams.otherPlayer}
          on:focus={() => (focusCard = 1)}
        />
      </FormCard>

      <FormCard
        itemNumber={2}
        emptyHeader="Select Time"
        filledHeader="Time"
        input={$creationParams.alarmTime}
        inputValid={(t) => t > 0}
      >
        <input
          id="select-time"
          class="bg-transparent outline-none text-center w-min"
          type="time"
          bind:value={$creationParams.alarmTime}
        />
      </FormCard>
      <FormCard
        itemNumber={3}
        emptyHeader="Select Days"
        filledHeader="Days"
        input={false}
        inputValid={(d) => d.length > 0}
      >
        <input
          id="select-time"
          class="bg-transparent outline-none text-center w-min"
          type="time"
          bind:value={$creationParams.alarmDays}
        />
      </FormCard>
      <FormCard
        itemNumber={4}
        emptyHeader="Select Bet Rules"
        filledHeader="Bet Rules"
        input={false}
        inputValid={(d) => d.length > 0}
      >
        <input
          id="select-time"
          class="bg-transparent outline-none text-center w-min"
          type="time"
          bind:value={$creationParams.alarmDays}
        />
      </FormCard>
    </div>
  </div>
</div>
