<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fieldTypeDictionary } from "./Helper/helper";
  import type { ArrayClasses } from "./types/interfaces";
  import Suggest from "./Ui/Suggest.svelte";
  import Input from "./Ui/Input.svelte";

  export let input: ArrayClasses = [];
  export let output: ArrayClasses = [];
  export let searchString: string = "";

  let isShowSearch: boolean = input.length > 5 ? true : false;
  let filterFromType: string;
  let colorSearchElement: "black" | "white" = input.length > 5 ? "white" : "black";

  function toggleSearchPanel() {
    isShowSearch = !isShowSearch;

    if (isShowSearch) {
      colorSearchElement = "white";
    } else {
      colorSearchElement = "black";
    }
  }

  async function onSearchFields() {
    let result = input;

    if (filterFromType) {
      result = input.filter((item) => item.type === filterFromType);
    }

    if (searchString) {
      result = result.filter((item) => item.name.toUpperCase().includes(searchString.toUpperCase()));
    }
    output = [];
    await tick();

    output = [...result];
  }

  function filterlistType(): { id: string; value: string }[] {
    let result: { id: string; value: string }[] = [];
    const typesArr = input.map((item) => item.type);

    result = [...fieldTypeDictionary.filter((item: any) => typesArr.includes(item.id))];

    return result;
  }
  onMount(() => {});
</script>

{#if input.length > 0}
  <div class="search-container" class:close-panel={!isShowSearch}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="button-container" class:close={!isShowSearch} on:click={toggleSearchPanel}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colorSearchElement}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </svg>
    </div>
    {#if isShowSearch}
      <div class="search-body">
        <Input bind:value={searchString} inputHndlr={onSearchFields} placeholder="Поиск по полям..." />
        {#if filterlistType().length > 1}
          <Suggest
            items={filterlistType()}
            bind:selected={filterFromType}
            onSelect={onSearchFields}
            placeholder="Выберите тип поля..."
          />
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .button-container {
    position: absolute;
    top: -44px;
    right: 9px;
    cursor: pointer;
  }
  .close {
    bottom: 1px;
  }
  .search-container {
    position: relative;
  }
  .search-body {
    padding: 3px;
    border: 1px solid rgb(218, 215, 215);
    border-radius: 3px;
    margin-bottom: 5px;
  }
  .close-panel {
    border: 0px;
    padding: 0px;
  }
</style>
