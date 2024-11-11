<script lang="ts">
  export let clickHandler = (event: any) => {};
  export let caption: string = "";
  export let style: string = ``;
</script>

<button class="custom-button" on:click={clickHandler} {style}>{caption}</button>

<style>
  .custom-button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    background-repeat: no-repeat;
  }
  .custom-button:hover {
    background-color: #0056b3;
  }
</style>
