<script lang="ts">
  import { onMount } from "svelte";
  import type { IMenuItems } from "./types/interfaces";
  import { typeOfAppItemClass } from "./Helper/const";
  import { getNameType, insertText } from "./Helper/helper";
  import AppItemClass from "../classes/AppItemClass";
  import Field from "../classes/FieldClass";
  import MainEntity from "./Ui/MainEntity.svelte";
  import MenuBurger from "./Ui/MenuBurger.svelte";

  export let appItem: AppItemClass | Field;
  export let level = 1;
  export let menuItems: IMenuItems[] = [];

  async function onClickItem() {
    if (appItem instanceof AppItemClass) {
      await appItem.getItems();

      appItem.isOpen = !appItem.isOpen;
    }
  }

  function getTypeItem(): string {
    return `(${getNameType(appItem.type)})`;
  }

  function changeCheckbox() {
    if (appItem instanceof Field) {
      console.log(appItem.getSource());
    }
    appItem.parent?.checked();
    console.log(appItem.parent);
  }

  onMount(() => {
    // console.log(appItem)
  });
</script>

<!-- style={`background-color: rgb(${218 - level},${215 - level - 7},${215 - level - 7});`} -->
<div class="app_item_container">
  <div
    class="app_item_name"
    title="{appItem.id} {getTypeItem()}"
    class:is-open={appItem instanceof AppItemClass && appItem.isOpen ? true : false}
    id={`${appItem.getSource()}.${appItem.id}`}
  >
    {#if appItem.isParentSingle() === false && typeOfAppItemClass.includes(appItem.type) === false}
      <input type="checkbox" class="custom-check" bind:checked={appItem._checked} on:change={changeCheckbox} />
    {/if}

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="label" class:white-text={level >= 67} on:click={onClickItem}>
      {appItem.name}
      {getTypeItem()}
      {#if appItem instanceof Field && appItem._modificators.length > 0}
        {@const modItems =
          appItem instanceof Field && appItem._modificators.length > 0
            ? appItem._modificators.map((item) => item.name).join(", ")
            : ""}
        <span class="modificators"> {modItems}</span>
        <!-- {#each appItem._modificators as mod, index (index)}
          <div class="modificators">{mod.name}</div>
        {/each} -->
      {/if}
    </div>

    {#if appItem instanceof AppItemClass === false}
      <MenuBurger {menuItems} arg={appItem} />
    {/if}
  </div>
  {#if appItem instanceof AppItemClass && appItem.isOpen}
    <MainEntity bind:mainEntity={appItem.items} level={level + 10} bind:parent={appItem} {menuItems} />
  {/if}
</div>

<style>
  .app_item_container {
    border-radius: 5px;
    border: 1px solid rgb(226, 218, 218);
    margin-bottom: 5px;
  }
  .app_item_name {
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    padding: 10px 15px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color 0.3s;
  }
  .app_item_name:hover {
    color: white;
    background-color: #e0e0e0;
    /* border-radius: 3px; */
  }
  .is-open {
    color: white;
    background-color: #d8caca;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .custom-check {
    width: 20px;
    height: 20px;
    background-color: white;
    margin-right: 5px;
  }
  .white-text {
    color: white;
  }
  .modificators {
    font-style: italic;
  }
</style>
