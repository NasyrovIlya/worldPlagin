<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import type { IMenuItems, IModifier } from "../../../types/interfaces";
  import { fieldModifier, modifiersResp } from "../../../Helper/global";
  import { getModifiers, insertText, replaceFirstOccurrence, scrollToElementById } from "../../../Helper/helper";

  import Field from "../../../../classes/FieldClass";

  import MenuBurger from "../../MenuBurger.svelte";
  import Button from "../../Button.svelte";
  import Arguments from "./Arguments.svelte";

  export let field: Field | undefined = $fieldModifier;
  export let isShow: boolean = true;

  let modifiers: IModifier[] = [];
  let menuItems: IMenuItems[] = [
    {
      id: "apply_modifier",
      value: "Применить",
      callback: genModifierString,
    },
  ];

  function genModifierString(index: any) {
    if (modifiers[index].static === false && modifiers[index].arguments_description) {
      modifiers[index].showArguments = !modifiers[index].showArguments;

      modifiers = modifiers;
    } else {
      field?._modificators.push(modifiers[index]);
      // insertText(`{{ ${field?.getSampleString(true)}|${modifiers[index].id} }}`);
    }
  }

  function convertMidifierObject() {
    if ($modifiersResp && Object.keys($modifiersResp)?.length > 0) {
      modifiers = Object.keys($modifiersResp)
        .map((item) => ({
          id: item,
          name: $modifiersResp[item].name,
          arguments_description: $modifiersResp[item].arguments_description,
          modifier_description: $modifiersResp[item].modifier_description,
          usage_example: $modifiersResp[item].usage_example,
          static: $modifiersResp[item].static,
          showArguments: false,
        }))
        .sort((item, items) => item.static - items.static);
    }
  }

  function applyMod(modic: IModifier) {
    //TODO добавить функционал удаления модификатора из поля
    // добавить получение строки модификаторов при цикличном вводе полей
    field?._modificators.push(modic);
    // const reqArguments = modic.arguments_description.filter((item) => item.required && !item.value);

    // if (reqArguments.length > 0) {
    //   return;
    // }

    // let argumentValues: string = modic.id;
    // const shablon = modic.arguments_description.map((item) => `'${item.name}'`).join(", ");

    // argumentValues = replaceFirstOccurrence(
    //   shablon,
    //   argumentValues,
    //   modic.arguments_description
    //     .filter((item) => item.value)
    //     .map((item) => `'${item.value}'`)
    //     .join(", ")
    // );

    // insertText(`{{ ${field?.getSampleString(true)}|${argumentValues} }}`);
  }

  onMount(async () => {
    await getModifiers();
    convertMidifierObject();

    if (field && field._modificators.length > 0) {
      for (let index = 0; index < field._modificators.length; index++) {
        const element = field._modificators[index];
        let searchItem = modifiers.find((item) => item.id === element.id);

        if (searchItem) {
          searchItem = { ...element };
          searchItem.showArguments = true;
        }
      }
      console.log(modifiers);
      
      modifiers = modifiers;
    }

    scrollToElementById(`modifiers-body-id`);
  });

  onDestroy(() => {
    $fieldModifier = undefined;

    if (field) {
      scrollToElementById(`${field.getSource()}.${field.id}`);
    }
  });
</script>

{#if isShow === true}
  <div class="modifiers-body" id="modifiers-body-id">
    {#if field}
      <div class="item__name" style="margin-bottom: 10px;">Для поля: {field.name}</div>
      <Button caption="Назад" clickHandler={() => (isShow = false)} style="margin-bottom: 10px;" />
    {/if}
    {#if modifiers.length > 0}
      {#each modifiers as modifier, index (index)}
        <div class="mod-item-body">
          <div class="item__name-body">
            <div class="item__name">{modifier.name} ({modifier.id})</div>
            {#if field}
              <MenuBurger {menuItems} arg={index} />
            {/if}
          </div>

          <div class="item__description">
            <p>{modifier.modifier_description}</p>
          </div>

          <div class="item__exaple">
            <p>Пример: {modifier.usage_example}</p>
          </div>
          <div class="item__static">
            <div class="item__name" style="margin-right: 5px;">{modifier.static ? "Статичный" : "Динамичный"}</div>
          </div>

          {#if modifier.showArguments && modifier.static === false}
            <div class="item__arguments_description">
              {#if modifier.arguments_description?.length > 0}
                {#each modifier.arguments_description as argument, idx (idx)}
                  <Arguments bind:argumentDescription={argument} />
                {/each}
                <div class="control-button">
                  <Button caption="Применить модификатор" clickHandler={() => applyMod(modifier)} />
                </div>
                <!-- {:else}
                 -->
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
{/if}

<style>
  .item__name-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item__name {
    font-weight: bold;
  }
  .item__description,
  .item__exaple {
    padding: 0px 0px 0px 10px;
  }
  .modifiers-body {
    padding: 5px 15px;
  }
  .mod-item-body {
    padding: 5px 10px;
    border: 1px solid #dbd7d7;
    border-radius: 3px;
    margin-bottom: 5px;
    transition: background-color 0.3s;
  }
  .mod-item-body:nth-child(odd) {
    background-color: #ece5e5;
  }
  .mod-item-body:hover {
    background-color: #d4cbcb;
  }
  .item__static {
    display: flex;
    align-items: flex-start;
  }
</style>
