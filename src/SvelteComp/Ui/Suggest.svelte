<script lang="ts">
  interface ISuggestItem {
    id: any;
    value: string;
  }

  interface ISuggestFormattedItem {
    id: number | string;
    value: string;
    _key: string;
    _hide: boolean;
    _original: ISuggestItem;
  }

  export let items: ISuggestItem[] = [];
  export let selected: any = undefined;
  export let placeholder: string = "";
  export let classes: string = "";
  export let onSelect = (item: ISuggestItem) => {};
  export let disabled: boolean = false;

  let formattedItems: ISuggestFormattedItem[] = [];
  let itemsVisible = false;
  let searchQuery = selected ? (items.find((item) => item.id == selected)?.value ?? "") : "";
  let selectedName = searchQuery;
  let allHided = false;
  let componentWrapper: HTMLDivElement;

  $: _updateQuery(selected);
  $: _formatNewItems(items);
  $: _onSearch(searchQuery, formattedItems);

  function clearSelectItem() {
    selected = undefined;
    onSelect(selected);
  }

  function _updateQuery(triggers?) {
    if (selected === undefined) {
      searchQuery = "";
      selectedName = "";
    } else {
      searchQuery = items.find((item) => item.id == selected)?.value ?? "";
      selectedName = searchQuery;
    }
  }
  function _onSelect(item: ISuggestFormattedItem) {
    itemsVisible = false;
    selected = item._original.id;
    searchQuery = item.value;
    selectedName = item.value;

    if (onSelect && typeof onSelect === "function") onSelect(item._original);
  }

  function _formatNewItems(newItems: ISuggestItem[]) {
    if (typeof searchQuery !== "string") throw "Query должен быть строкой!";

    formattedItems = newItems.map((item) => ({
      ...item,
      _key: crypto.randomUUID(),
      _hide: searchQuery.length > 0 ? !item.value.toLowerCase().includes(searchQuery) : false,
      _original: item,
    }));
  }

  function _onSearch(query: string, triggers?) {
    allHided = true;

    if (typeof query !== "string") {
      throw "Query должен быть строкой!";
    }

    formattedItems.forEach((item, index) => {
      const isFound = query.length > 0 ? item.value.toLowerCase().includes(query?.toLowerCase()) : true;

      allHided = allHided && !isFound;

      const before = item._hide;

      item._hide = !isFound;
      if (before !== item._hide) {
        formattedItems[index] = { ...item };
      }
    });

    formattedItems = [...formattedItems];
  }

  function _collapseSuggests(event: MouseEvent) {
    if (disabled) {
      return;
    }
    if ((<HTMLElement>event.target).closest(".wrapper") === componentWrapper) {
      return;
    }
    searchQuery = selectedName;

    itemsVisible = false;
  }

  function _openSuggests(event: Event) {
    (<HTMLInputElement>componentWrapper.firstChild).focus();
    searchQuery = "";

    itemsVisible = true;
  }
</script>

<svelte:body on:click={_collapseSuggests} />
<div bind:this={componentWrapper} class="wrapper {classes}">
  <input on:focusin={_openSuggests} bind:value={searchQuery} {placeholder} {disabled} type="text" />

  {#if selected}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="clear-state-btn" on:click={clearSelectItem}>X</div>
  {/if}

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="collapse-state-btn {itemsVisible ? 'opened' : 'closed'}" on:click={_openSuggests} />
  {#if itemsVisible && !allHided}
    <ul class="suggests-list">
      {#each formattedItems as item (item._key)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li class:hide={item._hide} on:click={() => _onSelect(item)}>
          {item.value}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .wrapper {
    width: 95%;
    margin: 0;
    padding: 0;
    position: relative;
    background-color: white;
    --border-color: #dadadb;
    font-size: 15px;
    line-height: 20px;
  }
  input {
    /* padding: 5px; */
    /* border: 1px solid var(--border-color); */
    /* border-radius: 5px; */
    /* width: calc(100% - 5px - 2rem); */
    /* padding-right: 2rem; */

    border-radius: 0.4rem;
    border: 1px solid #d9d9d9;
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #fff;
    background-image: none;
    background-clip: padding-box;
    color: #252525;
    /* font-size: 1.4rem; */
    line-height: normal;
    transition:
      background 0.15s linear,
      box-shadow 0.15s linear;
    outline: none;
  }
  .collapse-state-btn {
    position: absolute;
    right: 15px;
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg) scale(0.65);
    cursor: text;
    --collapse-state-btn-border-color: #303030;
  }
  .clear-state-btn {
    position: absolute;
    bottom: 14px;
    right: 17px;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    color: red;
  }
  .collapse-state-btn.opened {
    top: 14px;
    right: 0px;
    border-top: 1px solid var(--collapse-state-btn-border-color);
    border-left: 1px solid var(--collapse-state-btn-border-color);
  }
  .collapse-state-btn.closed {
    top: 7px;
    right: 0px;
    border-right: 1px solid var(--collapse-state-btn-border-color);
    border-bottom: 1px solid var(--collapse-state-btn-border-color);
  }
  .suggests-list {
    position: absolute;
    left: 0;
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    list-style: none;
    user-select: none;
    cursor: pointer;
    z-index: 99999;
    background-color: white;
    max-height: 200px;
    overflow: auto;
  }
  .suggests-list::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }
  .suggests-list::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .suggests-list::-webkit-scrollbar-thumb {
    background-color: rgb(161, 161, 161);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  li {
    padding: 5px;
  }
  li:hover {
    background-color: rgb(200, 200, 200);
  }
  li.hide {
    display: none;
  }
</style>
