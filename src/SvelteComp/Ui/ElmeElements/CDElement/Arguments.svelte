<script lang="ts">
  import type { IArgumentsDescription } from "../../../types/interfaces";
  import Input from "../../Input.svelte";
  import Suggest from "../../Suggest.svelte";

  export let argumentDescription: IArgumentsDescription;

  let value: any = "";
</script>

<div class="argument-body">
  <div class="argument-name" class:required={argumentDescription.required}>
    {argumentDescription.name}
    {argumentDescription.required ? `*` : ``}
  </div>
  <div class="argument-values">
    {#if argumentDescription.values?.length > 0}
      <Suggest
        items={argumentDescription.values.map((item) => ({
          id: item.value,
          value: item.description ? item.description : item.value,
        }))}
        bind:selected={argumentDescription.value}
      />
    {:else}
      <Input bind:value={argumentDescription.value} placeholder="Значение" />
    {/if}
  </div>
</div>

<style>
  .argument-body {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .required {
    color: red;
    font-weight: bold;
  }
  .argument-values {
    flex: 1 1 75%;
  }
  .argument-name {
    flex: 1 1 25%;
    padding: 5px 10px;
  }
</style>
