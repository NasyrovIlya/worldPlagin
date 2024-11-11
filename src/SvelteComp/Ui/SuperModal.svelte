<script lang="ts">
  import { onMount } from 'svelte';

  export let visible = false; // открывает модальное окно
  export let isWhiteBack = false; // Белую подложку под модалку или черную
  export let styleModal = ''; // стили для модального окна
  export let styleHeader = ''; // стили для заголовка
  export let styleBody = ''; // стили для тела контента
  export let pixelModalWidth = 850; // ширина модального окна открытии
  export let pixelModalHeight = 400; // высота модального окна при открытии
  export let noResize: boolean = true; // размер модального окна рассчитывается от контента
  export let closeToNoModal: boolean = false;

  let modalBody;

  $: widthModal = noResize ? '' : `width: ${pixelModalWidth}px;`;

  $: heightModal = noResize ? '' : `height: ${pixelModalHeight}px;`;

  let dragOn = false;
  let dragStart = false;

  function closeModal() {
    visible = false;
  }

  function dragStartModal(e) {
    if (dragOn && dragStart && e.buttons === 1) {
      const marginLeft = document.documentElement.clientWidth - e.clientX;
      const marginTop = document.documentElement.clientHeight - e.clientY;

      pixelModalWidth = document.documentElement.clientWidth - marginLeft * 2;
      pixelModalHeight = document.documentElement.clientHeight - marginTop * 2;
    } else {
      dragOn = false;
      dragStart = false;
    }
  }

  function clickToNoModalHendler(event) {
    if (!event.target.closest('.certit-modal__content') && closeToNoModal) {
      closeModal();
    }
  }

  onMount(() => {
    const bodyElement = document.querySelector('body');

    bodyElement.insertAdjacentElement('beforeend', modalBody);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this="{modalBody}"
  class="certit-modal"
  class:content-modal__visible="{visible}"
  class:non-select-content="{dragStart}"
  class:white-back="{isWhiteBack}"
  on:click="{clickToNoModalHendler}"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="certit-modal__wrap" on:mousemove="{dragStartModal}">
    <div
      class="certit-modal__content"
      class:no-resize="{noResize}"
      style="{styleModal} {widthModal} {heightModal}"
    >
      <div class="certit-modal__header-body">
        <div class="certit-modal__header" style="{styleHeader}">
          <slot name="header" />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="certit-modal__close-btn non-select-content"
            on:click="{closeModal}"
          >
            X
          </div>
        </div>

        <div class="certit-modal__body" style="{styleBody}">
          <slot name="body" />
        </div>
      </div>
      <div class="certit-modal__footer">
        <slot name="footer" />
      </div>

      {#if noResize === false}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="certit-modal__resize"
          on:mousemove="{() => {
            if (dragOn) {
              dragStart = true;
            } else {
              dragStart = false;
            }
          }}"
          on:mousedown="{() => (dragOn = true)}"
        ></div>
      {/if}
    </div>
  </div>
</div>

<style>
  .certit-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .white-back {
    background-color: rgba(255, 255, 255, 0.8) !important;
  }

  .white-back .certit-modal__content {
    border: 1px solid #d5d2d2;
    box-shadow: 0px 0px 15px #d5d2d2;
  }

  .content-modal__visible {
    opacity: 1;
    visibility: visible;
  }

  .certit-modal__wrap {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* padding: 30px 10px; */
  }
  .certit-modal__content {
    background-color: white;
    color: black;
    min-width: 250px;
    min-height: 250px;
    max-width: 90%;
    max-height: 75%;
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .no-resize {
    min-width: 0px;
    min-height: 0px;
  }

  .certit-modal__header-body {
    overflow-x: auto;
  }

  .white-back .certit-modal__close-btn {
    color: black;
  }

  .certit-modal__close-btn {
    color: white;
    position: absolute;
    right: -20px;
    top: 0px;
    font-size: 20px !important;
    cursor: pointer;
  }

  .certit-modal__header {
    font-size: 40px;
    display: flex;
    justify-content: space-between;
    margin: 0px 0px 10px 0px;
    padding: 5px 15px;
    overflow-x: auto;
    max-height: 40%;
  }
  .certit-modal__footer {
    max-height: 20%;
    overflow-x: auto;
  }
  .certit-modal__resize {
    cursor: nwse-resize;
    position: absolute;
    bottom: -2px;
    right: -1px;
    background-image: url(https://statix.amocrm.ru/frontend/images/interface/sprite.png);
    background-position-y: -2421px;
    background-repeat: no-repeat;
    height: 11px;
    width: 7px;
    transform: rotate(45deg);
  }

  .non-select-content {
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
