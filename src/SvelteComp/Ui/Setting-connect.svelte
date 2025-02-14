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

  function testConntectionAmo() {
    $globalStore.amo.url = "https://certitdev.amocrm.ru/";
    $globalStore.amo.id = "a12ef9d4-47d7-4752-b6b6-531ac9359813";
    $globalStore.amo.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc5NTRkNzk5N2Y3ZTA3N2QxNjY4YmM5NTAxZmUyYzNjYzM1MGNmOGEzNmY2ZGNhOTU5OTFiYWI0YTczOWVlZTEwYjIxY2JlNzkyM2NiY2YwIn0.eyJhdWQiOiJhMTJlZjlkNC00N2Q3LTQ3NTItYjZiNi01MzFhYzkzNTk4MTMiLCJqdGkiOiI3OTU0ZDc5OTdmN2UwNzdkMTY2OGJjOTUwMWZlMmMzY2MzNTBjZjhhMzZmNmRjYTk1OTkxYmFiNGE3MzllZWUxMGIyMWNiZTc5MjNjYmNmMCIsImlhdCI6MTczMTY2MTAzNSwibmJmIjoxNzMxNjYxMDM1LCJleHAiOjE3MzQyMjA4MDAsInN1YiI6IjY2NzczMSIsImdyYW50X3R5cGUiOiIiLCJhY2NvdW50X2lkIjo5OTgwNDE4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiM2IwZTc4NjAtNzRiYy00MzEzLTk2NGUtNDdmNGQxY2ZjYmIxIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.kPChTE884fZjWcNS4lHEO4pIJ51FVI7885jFaPCkfFMLoFZn6sEB0vpXXmaDVKPooYHVhGNnody5L9n3FxJhTT9UxNT5Al_BGlgOoWvQIPrLN_OHR-N6EQmHyJzaVB7pDmKpv-84S4jHe3h9hTqPkjnrKW_unOGQF-2gRXonLUqehMA4tzqeEt53NSxUzygsZcPdrwff87GB8JIUWh_OLb5H8lnjCadKEp-3pi6BKeREBtO_Mb6Yw2KkkloZxhyXMjpbB-vWSZ9yzJWYoL2DVqEYsIPGTj8_-0oj69bHP6XAppl_O9H1PILoJgCtGVLWoaXcFHQcxB4bFK-QcQ5pJw";

    currentSetting.set("amoCrmStrings");
  }

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
    <Input placeholder="ID интеграции" bind:value={$globalStore.amo.id} />
    <Input placeholder="Ссылка (url)" bind:value={$globalStore.amo.url} />
    <Input placeholder="Токен" bind:value={$globalStore.amo.token}/>
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
