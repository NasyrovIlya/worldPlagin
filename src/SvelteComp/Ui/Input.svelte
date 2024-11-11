<script lang="ts">
  import { ETypeOfFieldValue } from "../types/interfaces";
  import CheckBox from "./CheckBox.svelte";

  export let placeholder: string = "";
  export let value: any = "";
  export let inputHndlr: (e: any) => void = (e) => {};
  export let typeInput: ETypeOfFieldValue = ETypeOfFieldValue.string;

  let dateValue: string = value;

  function formatDate(input: string | undefined) {
    if (input === undefined || input.trim() === "") {
      return "";
    }

    const dateParts = input.split("-");
    if (dateParts.length !== 3) {
      return "";
    }

    const [year, month, day] = dateParts;

    if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
      return "";
    }

    return `${day}.${month}.${year}`;
  }

  function converDate(e: any) {
    value = formatDate(dateValue);

    inputHndlr(e);
  }

  $: {
    if (typeInput === ETypeOfFieldValue.date) {
      if (value === "") {
        value = formatDate(dateValue);
      }
    }
  }
</script>

{#if typeInput === ETypeOfFieldValue.string}
  <input type="text" class="input-custom" title={placeholder} {placeholder} bind:value on:input={inputHndlr} />
{/if}

{#if typeInput === ETypeOfFieldValue.number}
  <input type="number" class="input-custom" title={placeholder} {placeholder} bind:value on:input={inputHndlr} />
{/if}

{#if typeInput === ETypeOfFieldValue.date}
  <input
    type="date"
    class="input-custom"
    title={placeholder}
    {placeholder}
    bind:value={dateValue}
    on:input={converDate}
  />
{/if}

{#if typeInput === ETypeOfFieldValue.boolean}
  {placeholder} <CheckBox bind:checked={value}></CheckBox>
{/if}

<style>
  .input-custom {
    width: 95%;
    border-radius: 0.4rem;
    border: 1px solid #d9d9d9;
    display: block;
    padding: 10px;
    background-color: #fff;
    background-image: none;
    background-clip: padding-box;
    color: #252525;
    line-height: normal;
    transition:
      background 0.15s linear,
      box-shadow 0.15s linear;
    outline: none;
    margin-bottom: 5px;
  }
</style>
