<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";

  import type { IMenuItems, IModifier } from "../../../types/interfaces";
  import { fieldModifier, modifiersResp } from "../../../Helper/global";
  import { getModifiers, loadSimulattion, scrollToElementById } from "../../../Helper/helper";

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

  function triggerModificatord() {
    modifiers = modifiers;
    loadSimulattion(300);
  }

  function genModifierString(index: any) {
    if (modifiers[index].static === false && modifiers[index].arguments_description) {
      modifiers[index].showArguments = !modifiers[index].showArguments;

      modifiers = modifiers;
    } else {
      applyMod(modifiers[index]);
    }
  }

  function convertMidifierObject() {
    if ($modifiersResp && Object.keys($modifiersResp)?.length > 0) {
      modifiers = [
        ...Object.keys($modifiersResp)
          .map((item: string) => ({
            id: item,
            name: $modifiersResp[item].name,
            arguments_description: $modifiersResp[item].arguments_description,
            modifier_description: $modifiersResp[item].modifier_description,
            usage_example: $modifiersResp[item].usage_example,
            static: $modifiersResp[item].static,
            showArguments: field?._modificators?.find((mod) => mod.id === item)?.showArguments
              ? field?._modificators?.find((mod) => mod.id === item)?.showArguments
              : false,
          }))
          .sort((item, items) => item.static - items.static),
      ];
    }
  }

  function applyMod(modic: IModifier) {
    let modInField = field?._modificators.find((item) => item.id === modic.id);

    if (modInField) {
      modInField = { ...modic };
    } else {
      field?._modificators.push(modic);
      modic.showArguments = false;
    }

    triggerModificatord();
  }

  onMount(async () => {
    await getModifiers();
    convertMidifierObject();

    scrollToElementById(`modifiers-body-id`);
  });

  function closeForm() {
    isShow = false;
  }

  function delMod(modifier: IModifier) {
    modifier.showArguments = false;
    modifier.arguments_description?.forEach((arg) => {
      arg.value = "";
    });
    field!._modificators = [...field!._modificators.filter((_) => _.id !== modifier.id)];

    triggerModificatord();
  }

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
      <Button caption="Назад" clickHandler={closeForm} style="margin-bottom: 10px;" />
    {/if}
    {#if modifiers.length > 0}
      {#each modifiers as modifier, index (index)}
        <div class="mod-item-body">
          <div class="item__name-body">
            <div class="item__name">
              {modifier.name} ({modifier.id})
            </div>
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

          {#if modifier.showArguments === true && modifier.static === false}
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
          {#if field?._modificators?.find((item) => item.id === modifier.id)}
            <div class="control-button" style="margin-top: 5px; margin-botton: 5px">
              <Button caption="Удалить модификатор" clickHandler={() => delMod(modifier)} />
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
