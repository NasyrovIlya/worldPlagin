<script lang="ts">
  import { globalStore, isLoad } from "../Helper/global";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import { currentSetting } from "../Helper/global";
  import { onMount } from "svelte";
  import { loadSimulattion } from "../Helper/helper";

  function testConntectionElma() {
    $globalStore.elma.getFieldsApp = "getFieldsApp";
    $globalStore.elma.getStructureApp = "getStructureApp";
    //$globalStore.elma.idIntegration = `7c1dbebe-2d99-4939-965e-d1134b12b37c`;
    //$globalStore.elma.url = `https://elma-dev.certit.ru/`;

    currentSetting.set("elmaStrings");
  }

  async function testConnectCd() {
    currentSetting.set("modifiers");
  }

  function testConntectionAmo() {}

  onMount(() => {
    loadSimulattion();
  });
</script>

<div class="setting-connect-container">
  <div class="setting-elma">
    <h2>Настройки соединения Elma</h2>
    <Input placeholder="ID интеграции" bind:value={$globalStore.elma.idIntegration} />
    <Input placeholder="Ссылка (url)" bind:value={$globalStore.elma.url} />
    <Input placeholder="Функция получения Структуры (getStructureApp)" bind:value={$globalStore.elma.getStructureApp} />
    <Input placeholder="Функция получения Полей (getFieldsApp)" bind:value={$globalStore.elma.getFieldsApp} />

    <Button clickHandler={testConntectionElma} caption="Перейти" />
  </div>
  <div class="setting-amo">
    <h2>Настройки соединения amoCrm</h2>
    <Input placeholder="ID интеграции" />
    <Input placeholder="Ссылка (url)" />
    <Button clickHandler={testConntectionAmo} caption="Проверить" />
  </div>

  <div class="setting-center-doc">
    <h2>Настройки Центр Док</h2>
    <Input placeholder="Ссылка (url)" bind:value={$globalStore.cd.url} />

    <Button clickHandler={testConnectCd} caption="Проверить" />
  </div>
</div>

<style>
  .setting-connect-container {
    padding: 10px;
  }
  .setting-elma {
    margin-bottom: 15px;
  }
</style>
