<script lang="ts">
  import { onMount } from "svelte";
  import { currentSetting } from "../Helper/global";
  import { options } from "../Helper/const";

  import Button from "./Button.svelte";

  let isOpen = false;

  function selectSetting(option: { label: string; value: string }) {
    currentSetting.set(option.value);
    isOpen = false;
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closseMenu(event: any) {
    if (!event.target.closest(".menu")) {
      isOpen = false;
    }
  }

  onMount(() => {
    const bodyElement = document.querySelector(".main-container");

    if (bodyElement) {
      bodyElement.removeEventListener("click", closseMenu, true);
      bodyElement.addEventListener("click", closseMenu, true);
    }
  });
</script>

<div class="menu-container">
  <div class="take-item-menu">{options.find((item) => item.value === $currentSetting)?.label}</div>
  <Button clickHandler={toggleMenu} caption="Меню" />

  {#if isOpen}
    <div class="menu">
      {#each options as option}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="option {option.value === $currentSetting ? 'active' : ''}" on:click={() => selectSetting(option)}>
          {option.label}
        </div>
      {/each}
    </div>
  {/if}

  <!-- <div>
      <h4>Текущая настройка: {$currentSetting}</h4>
  </div> -->
</div>

<style>
  .menu-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative; /* Позволяет абсолютное позиционирование меню внутри контейнера */
    padding: 10px 10px;
  }

  .take-item-menu {
    margin-left: 15px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .menu {
    width: 250px;
    background-color: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 42px;
    right: 0;
    z-index: 1; /* Убедитесь, что меню будет выше других элементов */
  }

  .option {
    padding: 10px;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.3s;
  }

  .option:hover {
    background-color: #e0e0e0;
  }

  .active {
    background-color: #d0e9ff;
    font-weight: bold;
  }
</style>
