<script lang="ts">
  import { onMount } from "svelte";
  import AppItemClass from "../../classes/AppItemClass";
  import MainEntity from "../Ui/MainEntity.svelte";

  async function sendBtn() {
    if (AppItemClass.allApps.length === 0) {
      await AppItemClass.getBaseStructure("elma");
    }
  }

  onMount(() => {
    sendBtn();
  });
</script>

<div class="settings-container">
  <MainEntity mainEntity={AppItemClass.allApps} />
</div>

<style>
  .settings-container {
    padding-top: 45px;
  }
</style>
