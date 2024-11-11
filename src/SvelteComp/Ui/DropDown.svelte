<script lang="ts">
  import type { IDropDownFormattedGroup, IDropDownFormattedItem, IDropDownItem } from "../types/interfaces";

  export let items: IDropDownItem[] = [];
  export let selected: any[] = [];
  export let classes: string = "";
  export let onSelect = (selected: IDropDownItem[], item?: IDropDownItem) => {};

  const defaultGroupId = crypto.randomUUID();
  let itemsVisible = false;
  let componentWrapper: HTMLDivElement;
  let groupsFilling: { [key: string]: IDropDownFormattedItem[] } = {
    [defaultGroupId]: [],
  };
  let groupsInfo: { [key: string]: IDropDownFormattedGroup } = {
    [defaultGroupId]: {
      id: defaultGroupId,
      value: "Без группы",
      _checkedCount: 0,
      _showed: true,
    },
  };
  let innerSelected: IDropDownItem[] = [];
  let withGroups = false;
  let groupSelecting = false;
  let allSelecting = false;
  const emptyArrayLength = 0;

  $: {
    innerSelected = selected
      .map((item) => {
        const targetItem = items.find((target) => {
          let itsIt = true;

          if (target.id != item) {
            itsIt = false;
          }
          //   if (target.group?.id != item.group?.id) itsIt = false;

          return itsIt;
        });

        return targetItem;
      })
      .filter((item) => item);
  }

  $: {
    _resetGroups();
    _formatNewGroups();
    _formatNewItems(items, selected);
  }

  function updateSelected() {
    selected = innerSelected.map((item) => item.id);
  }

  function _resetGroups() {
    groupsFilling = { [defaultGroupId]: [] };
    groupsInfo = {
      [defaultGroupId]: {
        id: defaultGroupId,
        value: "Без группы",
        _checkedCount: 0,
        _showed: true,
      },
    };
  }

  function _formatNewGroups() {
    items.forEach((item) => {
      if (!item.group || groupsInfo[item.group.id]) {
        return;
      }

      groupsInfo[item.group.id] = {
        ...item.group,
        _checkedCount: 0,
        _showed: true,
      };
      groupsFilling[item.group.id] = [];
    });

    withGroups = Object.keys(groupsFilling).length > 1;
  }

  function _formatNewItems(newItems: IDropDownItem[], trigger?: any) {
    newItems.forEach((item) => {
      const group: IDropDownFormattedGroup = item.group ? groupsInfo[item.group.id] : groupsInfo[defaultGroupId];
      const isChecked = innerSelected.includes(item);
      const fromattedItem = {
        ...item,
        group: group,
        _key: crypto.randomUUID(),
        _original: item,
        _checked: isChecked,
      };

      groupsFilling[fromattedItem.group.id].push(fromattedItem);
      groupsInfo[fromattedItem.group.id]._checkedCount += Number(isChecked);
    });
  }

  function _changeDropDownState() {
    if (itemsVisible) {
      _collapseDropDown();
    } else {
      _openDropDown();
    }
  }

  function _collapseOnMissClick(event: MouseEvent) {
    if (!document.body.contains(componentWrapper)) {
      document.body.removeEventListener("click", _collapseOnMissClick);

      return true;
    }

    if (!componentWrapper.contains(<Node>event.target)) {
      _collapseDropDown();
    }
  }

  function _collapseDropDown() {
    itemsVisible = false;
  }

  function _openDropDown() {
    itemsVisible = true;
  }

  function _changeGroupState(group: IDropDownFormattedGroup) {
    if (group._showed) {
      group._showed = false;
    } else {
      group._showed = true;
    }

    groupsInfo[group.id] = { ...group };
  }

  function _onAllActionCheckboxChanged(event: Event) {
    allSelecting = true;
    if (innerSelected.length) {
      Object.values(groupsInfo).forEach((group) => {
        if (group._checkedCount) {
          _onCheckGroup(group);
        }
      });
    } else {
      Object.values(groupsInfo).forEach((group) => _onCheckGroup(group));
    }

    updateSelected();
    onSelect(innerSelected);
    allSelecting = false;
  }

  function _onCheckGroup(group: IDropDownFormattedGroup) {
    groupSelecting = true;
    if (group._checkedCount) {
      groupsFilling[group.id].forEach((item, index) => {
        if (item._checked) {
          _onCheck(item, group, index);
        }
      });
    } else {
      groupsFilling[group.id].forEach((item, index) => _onCheck(item, group, index));
    }

    if (!allSelecting) {
      updateSelected();
      onSelect(innerSelected);
    }

    groupSelecting = false;
  }

  function _onCheck(item: IDropDownFormattedItem, group: IDropDownFormattedGroup, index: number) {
    if (item._checked) {
      item._checked = false;
      group._checkedCount -= 1;
      innerSelected = innerSelected.filter((oldItem) => oldItem !== item._original);
    } else {
      item._checked = true;
      group._checkedCount += 1;
      innerSelected = [...innerSelected, item._original];
    }

    groupsFilling[group.id][index] = { ...item };
    groupsInfo[group.id] = { ...group };

    if (!groupSelecting) {
      updateSelected();
      onSelect(innerSelected, item._original);
    }
  }

  function _allCheckboxClassSelect(itemsCount) {
    if (itemsCount === emptyArrayLength) return "";
    if (itemsCount < items.length) return "some-selected";

    return "all-selected";
  }

  function _groupCheckboxClassSelect(group: IDropDownFormattedGroup) {
    if (group._checkedCount === emptyArrayLength) return "";
    if (group._checkedCount < groupsFilling[group.id].length) return "some-selected";

    return "all-selected";
  }
</script>

<svelte:body on:click={_collapseOnMissClick} />
<div bind:this={componentWrapper} class="wrapper {classes}">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="front-drop-down-button" on:click|self={_changeDropDownState}>
    <label>
      <input type="checkbox" on:change|preventDefault|stopPropagation={_onAllActionCheckboxChanged} />
      <span class={_allCheckboxClassSelect(innerSelected.length)} />
    </label>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click|self={_changeDropDownState}>{itemsVisible ? "Все" : `Выбрано: ${innerSelected.length}`}</span>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|self={_changeDropDownState} class="collapse-state-btn {itemsVisible ? 'opened' : 'closed'}" />
  </div>
  {#if itemsVisible}
    <ul class="drop-down-list">
      {#each Object.values(groupsInfo) as group (group.id)}
        <li class="drop-down-group" class:hidden={!withGroups || !groupsFilling[group.id].length} title={group.value}>
          <label>
            <input type="checkbox" on:change|preventDefault|stopPropagation={() => _onCheckGroup(group)} />
            <span class={_groupCheckboxClassSelect(group)} />
          </label>
          <span>{group.value}</span>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click|self={() => _changeGroupState(group)}
            class="collapse-state-btn {group._showed ? 'opened' : 'closed'}"
          />
        </li>
        {#if group._showed}
          {#each groupsFilling[group.id] as item, index (item._key)}
            <li class="drop-down-item" title={item.value}>
              <div class:group-spacing={withGroups} />
              <label>
                <input type="checkbox" on:change|preventDefault|stopPropagation={() => _onCheck(item, group, index)} />
                <span class:all-selected={item._checked} />
              </label>
              <span>{item.value}</span>
            </li>
          {/each}
        {/if}
      {/each}
    </ul>
  {/if}
</div>

<style>
  .wrapper {
    margin: 0;
    padding: 0;
    position: relative;
    background-color: white;
    --border-color: #dadadb;
    font-size: 15px;
    line-height: 20px;
  }
  .front-drop-down-button,
  .drop-down-group {
    padding: 10px;
    position: relative;
    border: 1px solid var(--border-color);
    border-radius: 0.4rem;
    /* width: calc(100% - 5px - 2rem); */
    /* padding-right: 2rem; */
    user-select: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  label {
    width: 1.1rem;
    min-width: 1.1rem;
    height: 1.1rem;
    border: 1px solid black;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  input[type="checkbox"] {
    display: none;
  }
  label span.some-selected {
    width: 50%;
    outline: 1px solid black;
  }
  label span.all-selected {
    width: 80%;
    height: 80%;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128.411 128.411"><polygon points="127.526,15.294 45.665,78.216 0.863,42.861 0,59.255 44.479,113.117 128.411,31.666 %09%09"/></svg>');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .collapse-state-btn {
    position: absolute;
    right: 0.25rem;
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg) scale(0.65);
    cursor: pointer;
    --collapse-state-btn-border-color: #303030;
  }
  .collapse-state-btn.opened {
    top: 14px;
    right: 18px;
    border-top: 1px solid var(--collapse-state-btn-border-color);
    border-left: 1px solid var(--collapse-state-btn-border-color);
  }
  .collapse-state-btn.closed {
    top: 9px;
    right: 18px;
    border-right: 1px solid var(--collapse-state-btn-border-color);
    border-bottom: 1px solid var(--collapse-state-btn-border-color);
  }
  .drop-down-list {
    position: absolute;
    left: 0;
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: 0.4rem;
    list-style: none;
    user-select: none;
    cursor: pointer;
    z-index: 99999;
    background-color: white;
    max-height: 200px;
    overflow: auto;
  }
  .drop-down-list::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  .drop-down-list::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .drop-down-list::-webkit-scrollbar-thumb {
    background-color: rgb(161, 161, 161);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .drop-down-group {
    border: none;
    border-radius: 0;
    box-shadow: 0 0px 3px 2px #cfcfcf;
    cursor: auto;
  }
  li {
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: auto;
  }
  li > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
  }
  li div:first-child {
    display: none;
  }
  .hidden {
    display: none !important;
  }
  .group-spacing {
    display: block !important;
    width: 10%;
    max-width: 20px;
    height: 100%;
  }
</style>
