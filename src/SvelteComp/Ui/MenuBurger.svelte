<script lang="ts">
  import { onMount } from "svelte";
  import type { IMenuItems } from "../types/interfaces";

  let isOpen = false;

  export let menuItems: IMenuItems[] = [];
  export let arg: any;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closseMenu(event: any) {
    if (!event.target.closest(".menu-burger")) {
      isOpen = false;
    }
  }

  function clickToMenu(index: number) {
    try {
      menuItems[index].callback(arg);
    } catch (error) {
      console.log(error);
    }

    isOpen = false;
  }

  onMount(() => {
    const bodyElement = document.querySelector("#app-start");

    if (bodyElement) {
      bodyElement.removeEventListener("click", closseMenu, true);
      bodyElement.addEventListener("click", closseMenu, true);
    }
  });
</script>

{#if menuItems?.length}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="burger" on:click={toggleMenu} class:open={isOpen}>
    <div class="line line1"></div>
    <div class="line line2"></div>
    <div class="line line3"></div>
  </div>

  {#if isOpen}
    <div class="menu-burger">
      <ul>
        {#each menuItems as item, index (index)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <li class="my-item-li">
            <div
              on:click={() => {
                clickToMenu(index);
              }}
            >
              {item.value}
            </div>
          </li>
        {/each}

        <!-- <li><a href="#second">Второй пункт</a></li>
      <li><a href="#third">Третий пункт</a></li> -->
      </ul>
    </div>
  {/if}
{/if}

<style>
  .burger {
    cursor: pointer;
    width: 15px;
    height: 13px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
  }
  .menu-burger {
    position: absolute;
    right: 50px;
    padding: 5px 10px 5px 10px;
    background-color: #918e8e;
    border-radius: 5px;
    z-index: 99999;
  }
  .line {
    background-color: #918e8e;
    height: 3px;
    transition: all 0.3s ease;
  }
  .open .line1 {
    transform: rotate(45deg) translate(5px, 5px);
  }
  .my-item-li {
    transition: all 0.3s ease;
    list-style-type: none;
    padding: 10px 15px;
  }
  .my-item-li:hover {
    color: white;
    cursor: pointer;
    background-color: #a59d9d;
  }
  .open .line2 {
    opacity: 0;
  }

  .open .line3 {
    transform: rotate(-45deg) translate(5px, -5px);
  }
</style>
