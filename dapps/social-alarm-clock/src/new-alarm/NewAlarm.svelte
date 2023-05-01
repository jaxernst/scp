<script>
  import SelectPartner from "./form-cards/SelectPartner.svelte";

  const optionCardStyle =
    " p-1 bg-zinc-700 h-[85px] rounded-xl w-[110px] relative transition focus:scale-110 focus:border-zinc-200 focus:border ";
</script>

<div class="flex flex-col gap-4 justify-center">
  <div>
    <h3 class="py-2">Join an Alarm</h3>
    <div class=" h-[30px] rounded-xl mx-2 flex gap-2">
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
    <h3 class="py-2">Create an Alarm</h3>
    <div class="flex gap-3 mx-2 text-zinc-300">
      <button class={optionCardStyle + "relative"}>
        <div class="absolute top-0 left-1 text-s text-bold text-zinc-500">
          1
        </div>
        <div class="">Select Partner</div>
      </button>
      <button class={optionCardStyle}>
        <div class="absolute top-0 left-1 text-s text-bold text-zinc-500">
          2
        </div>
        <div class="">Select Alarm Time</div>
      </button>
      <button class={optionCardStyle}>
        <div class="absolute top-0 left-1 text-s text-bold text-zinc-500">
          3
        </div>
        <div class="">Select Alarms Days</div>
      </button>
      <button class={optionCardStyle}>
        <div class="absolute top-0 left-1 text-s text-bold text-zinc-500">
          4
        </div>
        <div class="">Select Bet Rules</div>
      </button>
    </div>
  </div>
</div>
