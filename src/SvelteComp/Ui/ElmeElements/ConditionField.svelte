<script lang="ts">
  import { onMount } from "svelte";
  import type ConditionItemClass from "../../../classes/ConditionItemClass";
  import { ETypeOfFieldValue } from "../../types/interfaces";

  import Button from "../Button.svelte";
  import DropDown from "../DropDown.svelte";
  import Input from "../Input.svelte";
  import Suggest from "../Suggest.svelte";

  export let conditionItem: ConditionItemClass;
  export let isShowLastPathItem: boolean = false;

  let isSuggest: boolean = false;

  function selectHandler() {
    if (conditionItem.condition === "OneOf" || conditionItem.condition === "None") {
      isSuggest = false;

      conditionItem.value = [];
    } else {
      isSuggest = true;
      conditionItem.value = "";
    }

    conditionItem = conditionItem;
    console.log(conditionItem);
  }

  function chooseField() {
    isShowLastPathItem = true;
    conditionItem.value = "";
    conditionItem.condition = "";

    conditionItem = conditionItem;
  }

  onMount(() => {
    if (conditionItem.field) {
      isShowLastPathItem = false;
    }
  });
</script>

{#if conditionItem.field && isShowLastPathItem === false}
  <div class="start-condition">
    Если <span class="field-name">"{conditionItem.field.name}"</span>
    <Button caption="Выбрать полсе" clickHandler={chooseField} />
  </div>
  <Suggest
    items={conditionItem.getConditionFromField()}
    bind:selected={conditionItem.condition}
    onSelect={selectHandler}
  />

  {#if conditionItem.condition}
    {@const enums = conditionItem.getNumberFromTypeField()}

    {#if enums === ETypeOfFieldValue.enum}
      {#if isSuggest}
        <Suggest items={conditionItem.getContextField()} bind:selected={conditionItem.value} />
      {:else}
        <DropDown items={conditionItem.getContextField()} bind:selected={conditionItem.value} />
      {/if}
    {:else}
      <Input bind:value={conditionItem.value} typeInput={enums} />
    {/if}
  {/if}
{/if}

<style>
  .field-name {
    font-weight: bold;
    font-size: medium;
  }
  .start-condition {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
