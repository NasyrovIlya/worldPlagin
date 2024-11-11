<script lang="ts">
  import { onMount } from "svelte";

  import type { IConditions } from "../../types/interfaces";
  import AppItemClass from "../../../classes/AppItemClass";
  import ConditionClass from "../../../classes/ConditionClass";

  import { insertText, loadSimulattion } from "../../Helper/helper";
  import { betweenConditions } from "../../Helper/const";

  import ConditionItem from "./ConditionItem.svelte";
  import Button from "../Button.svelte";
  import Suggest from "../Suggest.svelte";

  export let mainApp: AppItemClass;
  export let isVisible: boolean = false;

  let conditionsFromMainApp: IConditions[] = [];

  function triggerConditions() {
    ConditionClass.conditions = [...ConditionClass.conditions];

    conditionsFromMainApp = [...ConditionClass.conditions.filter((item) => item.mainApp.id === mainApp.id)];
  }

  function addConditions() {
    ConditionClass.createNewConditions(mainApp, []);

    triggerConditions();
  }

  function deleteConditions(index: number) {
    ConditionClass.deleteConditionItems(mainApp, index);

    triggerConditions();
  }

  async function insertConditionStringInDoc(app: AppItemClass) {
    insertText(await ConditionClass.getConditionString(app));
  }

  onMount(() => {
    conditionsFromMainApp = ConditionClass.conditions.filter((item) => item.mainApp.id === mainApp.id);

    loadSimulattion(300);
  });
</script>

{#if isVisible}
  <div class="condition-constructor-container">
    <div class="button-container-top">
      <Button caption="Назад" clickHandler={() => (isVisible = !isVisible)} />
      <Button caption="Добавить условие" clickHandler={addConditions} />
    </div>

    <div class="conditions-body">
      {#each conditionsFromMainApp as conditions, index (index)}
        <div class="condition-item">
          <div class="condition-item-name">
            {conditions.mainApp.name}
          </div>
          <div class="condition-items-body">
            {#each conditions.conditions as condition, idx (idx)}
              <div class="condition-item-body">
                <ConditionItem bind:conditionItem={condition} bind:mainApp={conditions.mainApp} />
                <div class="button-container-bottom">
                  {#if conditions.conditions.length > 1 && idx !== conditions.conditions.length - 1}
                    <Suggest items={betweenConditions} bind:selected={condition.betweenConditions} />
                  {/if}
                  <Button
                    caption="Удалить условие"
                    clickHandler={() => deleteConditions(idx)}
                    style="margin-top:10px;"
                  />
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="button-container-bottom">
      <Button caption="Добавить условие" clickHandler={addConditions} />
      {#if conditionsFromMainApp.length === 1 && conditionsFromMainApp[0].conditions.length !== 0 && conditionsFromMainApp[0].conditions.filter((item) => item.value === "").length === 0}
        <Button
          caption="Вставить условие"
          clickHandler={() => insertConditionStringInDoc(conditionsFromMainApp[0].mainApp)}
        />
      {/if}
    </div>
  </div>
{/if}

<style>
  .condition-constructor-container {
    padding: 10px;
  }
  .button-container-bottom,
  .button-container-top {
    padding: 15px 5px;
  }
  .button-container-top {
    border-bottom: 1px solid rgb(190, 196, 196);
  }
  .button-container-bottom {
    border-top: 1px solid rgb(190, 196, 196);
  }
  .condition-item-body {
    background-color: rgb(190, 196, 196);
    margin-bottom: 5px;
    padding: 5px 10px;
  }
  .condition-item-name {
    font-weight: bold;
    margin: 10px 0px;
  }
</style>
