<script lang="ts">
  import { isLoad } from "../Helper/global";
  import Spinner from "./Spinner.svelte";
</script>

<div class="overlay {$isLoad ? 'active' : ''}">
  <Spinner />
</div>

<style>
  .overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0); /* Начальное затемнение */
    backdrop-filter: blur(0px); /* Начальное размытие */
    z-index: 1000; /* Убедитесь, что элемент выше других */
    transition:
      background-color 0.3s ease,
      backdrop-filter 0.3s ease; /* Плавный переход */
    pointer-events: none; /* Отключаем взаимодействие, когда не активно */
  }
  .active {
    display: block;
    background-color: rgba(0, 0, 0, 0.2); /* Затемнение при активации */
    backdrop-filter: blur(3px); /* Размытие при активации */
    pointer-events: auto; /* Включаем взаимодействие при активации */
  }
</style>
