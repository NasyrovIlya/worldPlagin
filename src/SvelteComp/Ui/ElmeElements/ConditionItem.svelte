<script lang="ts">
  import AppItemClass from "../../../classes/AppItemClass";
  import ConditionClass from "../../../classes/ConditionClass";

  import type ConditionItemClass from "../../../classes/ConditionItemClass";
  import Field from "../../../classes/FieldClass";

  import Suggest from "../Suggest.svelte";
  import ConditionField from "./ConditionField.svelte";

  export let conditionItem: ConditionItemClass;
  export let mainApp: AppItemClass;

  let isShowLastPathItem: boolean = true;

  function triggerConditions() {
    conditionItem = conditionItem;
  }

  async function selectFieldName(sel: AppItemClass | Field | undefined, indexPath: number) {
    if (!sel) {
      conditionItem.path = [...conditionItem.path.filter((_, idx) => indexPath >= idx && _)];
    }

    if (sel instanceof AppItemClass) {
      await sel.getItems();
      conditionItem.path = [...conditionItem.path.filter((_, idx) => indexPath >= idx && _)];
    }

    conditionItem.clearField();

    if (sel instanceof Field) {
      conditionItem.field = sel;
      conditionItem.path = [...conditionItem.path.filter((_, idx) => indexPath - 1 >= idx && _)];
      isShowLastPathItem = false;
    }

    triggerConditions();
    console.log(conditionItem);
  }
</script>

<div class="condition-item">
  <Suggest
    items={ConditionClass.getAppitems(mainApp)}
    bind:selected={conditionItem.path[0]}
    onSelect={async () => {
      await selectFieldName(conditionItem.path[0], 0);
    }}
  />
  <div class="condition-field">
    {#each conditionItem.path as pathItem, idx (idx)}
      {#if conditionItem.path.length - 1 !== idx || isShowLastPathItem === true}
        <Suggest
          items={pathItem.items ? ConditionClass.getAppitems(pathItem) : []}
          bind:selected={conditionItem.path[idx + 1]}
          onSelect={async () => {
            await selectFieldName(conditionItem.path[idx + 1], idx + 1);
          }}
        />
      {/if}
    {/each}

    <ConditionField bind:conditionItem bind:isShowLastPathItem />
  </div>
</div>

<style>
  .condition-item {
    display: flex;
    flex-direction: column;
    /* margin-bottom: 5px;
    padding: 5px 10px; */
  }
  .condition-field {
    flex: 1;
  }
</style>
