<script lang="ts">
  import AppItemClass from "../../classes/AppItemClass";
  import AppItemComp from "../AppItemComp.svelte";
  import { insertText } from "../Helper/helper";
  import Search from "../Search.svelte";
  import type { ArrayClasses, IMenuItems } from "../types/interfaces";

  export let mainEntity: ArrayClasses = [];
  export let level = 1;
  export let parent: AppItemClass | undefined = undefined;
  export let menuItems: IMenuItems[] = [];

  let filterEntity: ArrayClasses = mainEntity;

  function checkAll() {
    parent?.checkAll();
    filterEntity = filterEntity;
  }

  function clearAll() {
    parent?.clearAll();
    filterEntity = filterEntity;
  }

  async function insertString() {
    const shablonString = parent?._getStringFor();

    if (shablonString) {
      insertText(shablonString);
    }
  }
</script>

<div class="entity_container">
  <Search bind:input={mainEntity} bind:output={filterEntity} />

  {#if parent?.isParentSingle() === false || parent?.single === false}
    <div class="button-control-containrt">
      <button on:click={checkAll}>Выбрать все</button>
      <button on:click={clearAll}>Убрать все</button>
    </div>
  {/if}

  {#each filterEntity as item, index (index)}
    <div class="app-item-container">
      <AppItemComp bind:appItem={item} {level} {menuItems} />
    </div>
  {/each}

  {#if parent?.isParentSingle() === false || parent?.single === false}
    <div class="button-control-containrt">
      <button on:click={insertString}>Вставить шаблонную строку</button>
      <button on:click={checkAll}>Выбрать все</button>
      <button on:click={clearAll}>Убрать все</button>
    </div>
  {/if}
</div>

<style>
  .entity_container {
    margin-left: 5px;
    padding-bottom: 5px;
  }
  .app-item-container {
    /* padding: 3px; */
    /* border: 1px solid rgb(218, 215, 215); */
    /* border-radius: 7px; */
    /* margin-bottom: 10px; */
    margin-left: 10px;
  }
  .button-control-containrt {
    margin-left: 10px;
    padding: 5px 0px 5px 0px;
  }
</style>
