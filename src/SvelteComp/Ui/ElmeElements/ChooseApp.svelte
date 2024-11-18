<script lang="ts">
  import { onMount } from "svelte";
  import { constructorBurgerItem } from "../../Helper/const";
  import { insertText, loadSimulattion } from "../../Helper/helper";
  import { fieldModifier } from "../../Helper/global";
  import type { EntityString } from "../../types/interfaces";

  import AppItemClass from "../../../classes/AppItemClass";
  import ConditionClass from "../../../classes/ConditionClass";

  import Input from "../Input.svelte";
  import Button from "../Button.svelte";
  import Field from "../../../classes/FieldClass";
  import AppItemComp from "../../AppItemComp.svelte";
  import Search from "../../Search.svelte";
  import ConditionConstructor from "./ConditionConstructor.svelte";
  import Modifiers from "./CDElement/Modifiers.svelte";

  export let system: EntityString = `elma`;

  let searchStringNs: string = "";
  let searchStringCode: string = "";
  let allItems: AppItemClass[] = [];

  let filterNamespace: AppItemClass[] = []; // отфильтрованный список разделов Elma
  let filterCode: (AppItemClass | Field)[] | undefined = []; // отфильтрованный список приложений выбранного раздела
  let testFilter: (AppItemClass | Field)[] = [];

  let nsItemSelect: AppItemClass | undefined; // Список разделов Elma
  let codeItemSelect: AppItemClass | Field | undefined; // Список приложений выбранного раздела

  let isShowConstructor: boolean = false; // флаг для показа формы конструктора условий
  let isShowModifier: boolean = false; // флаг для показа формы выбора модификаторов

  async function getBaseStructure() {
    if (AppItemClass.allApps.filter((item) => item.entity === system).length === 0) {
      await AppItemClass.getBaseStructure(system);
    }

    allItems = [...AppItemClass.allApps.filter((item) => item.items?.length > 0 && item.entity === system)];
    filterNamespace = [...allItems];
  }

  function searchNamespace() {
    filterNamespace = allItems.filter(
      (item) => item.entity === system && item.name.toUpperCase().includes(searchStringNs.toUpperCase())
    );
  }

  function searchCode() {
    filterCode = nsItemSelect?.items?.filter((item) =>
      item.name.toUpperCase().includes(searchStringCode.toUpperCase())
    );
  }

  function chooseNamespaceItem(nsItem: AppItemClass) {
    searchStringCode = "";
    nsItemSelect = nsItem;
    filterCode = [...nsItem.items];
  }

  async function chooseCodeItem(nsItem: AppItemClass | Field) {
    codeItemSelect = nsItem;

    if (codeItemSelect instanceof AppItemClass) {
      if (!codeItemSelect.items.length) {
        await codeItemSelect.getItems();
      }

      testFilter = [...codeItemSelect.items];
    }
  }

  function clickHandler() {
    loadSimulattion(200);

    if (codeItemSelect) {
      codeItemSelect = undefined;
      searchCode();
    } else {
      nsItemSelect = undefined;
    }
  }

  function showConstructor() {
    isShowConstructor = true;
  }

  function callBackFromBurger(arg: Field | any) {
    if (arg instanceof Field) {
      const path = [...arg.parent.getPathToMain().filter((item) => item instanceof AppItemClass)];

      ConditionClass.createNewConditions(path[1], path.slice(2), arg);
      isShowConstructor = true;
      return [...arg.parent.getPathToMain(), arg];
    }

    return;
  }

  function callBackFromBurgerModifier(arg: Field | any) {
    if (arg instanceof Field) {
      $fieldModifier = arg;
      isShowModifier = true;
    }
    return;
  }

  function callBackFromBurgerShablon(arg: Field | any) {
    if (arg instanceof Field) {
      if (arg.isParentSingle() === true) {
        insertText(arg.getSampleString(false, false));
      }
    }
    return;
  }

  onMount(async () => {
    constructorBurgerItem[1].callback = callBackFromBurger;
    constructorBurgerItem[2].callback = callBackFromBurgerModifier;
    constructorBurgerItem[0].callback = callBackFromBurgerShablon;
    codeItemSelect = undefined;
    await getBaseStructure();

    console.log(AppItemClass.allApps);
  });
</script>

{#if isShowModifier}
  <Modifiers bind:isShow={isShowModifier} />
{:else if isShowConstructor && codeItemSelect && codeItemSelect instanceof AppItemClass}
  <ConditionConstructor bind:isVisible={isShowConstructor} mainApp={codeItemSelect} />
{:else}
  <div class="namespace-container">
    {#if nsItemSelect}
      <h3>{nsItemSelect.name} {codeItemSelect ? ` - ${codeItemSelect.name}` : ""}</h3>
      <div class="button-container">
        <Button caption="Назад" {clickHandler} />
        {#if codeItemSelect}
          <Button caption="Конструктор условий" clickHandler={showConstructor} />
        {/if}
      </div>

      {#if codeItemSelect && codeItemSelect instanceof AppItemClass && codeItemSelect.items.length > 0}
        <Search bind:input={codeItemSelect.items} bind:output={testFilter} />
        {#each testFilter as codeItem, index (index)}
          <AppItemComp appItem={codeItem} level={codeItemSelect.level + 1} menuItems={constructorBurgerItem}
          ></AppItemComp>
        {/each}
      {:else}
        <Input placeholder="Поиск по приложениям..." bind:value={searchStringCode} inputHndlr={searchCode} />
        {#if filterCode && filterCode.length > 0}
          {#each filterCode as codeItem, index (index)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="ns-item-body" on:click={() => chooseCodeItem(codeItem)}>
              <div class="ns-iten-name">{codeItem.name}</div>
            </div>
          {/each}
        {/if}
      {/if}
    {:else}
      <Input placeholder="Поиск по разделам..." bind:value={searchStringNs} inputHndlr={searchNamespace} />
      {#if filterNamespace.length}
        {#each filterNamespace as nsItem, index (index)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="ns-item-body" on:click={() => chooseNamespaceItem(nsItem)}>
            <div class="ns-iten-name">{nsItem.name}</div>
            <div class="ns-iten-count">{nsItem.items?.length}</div>
          </div>
        {/each}
      {/if}
    {/if}
  </div>
{/if}

<style>
  .namespace-container {
    padding: 10px;
  }
  .ns-item-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid rgb(226, 218, 218);
    margin-bottom: 3px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .ns-item-body:hover {
    background-color: #e0e0e0;
  }
  .button-container {
    margin-bottom: 10px;
  }
</style>
