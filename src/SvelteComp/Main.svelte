<script lang="ts">
  import { onMount } from "svelte";
  import Menu from "./Ui/Menu.svelte";
  import { currentSetting } from "../SvelteComp/Helper/global";
  // import Settings from "../SvelteComp/Settings/Settings.svelte";
  import SettingConnect from "./Ui/Setting-connect.svelte";
  import ChooseApp from "./Ui/ElmeElements/ChooseApp.svelte";
  import LoadPage from "./Ui/LoadPage.svelte";
  import Modifiers from "./Ui/ElmeElements/CDElement/Modifiers.svelte";

  onMount(() => {});
</script>

<LoadPage />
<div class="main-container">
  <Menu />
  {#if $currentSetting === "connect-settings"}
    <SettingConnect />
  {/if}
  {#if $currentSetting === "elmaStrings"}
    <ChooseApp />
    <!-- <Settings /> -->
  {/if}

  {#if $currentSetting === "modifiers"}
    <Modifiers />
  {/if}
</div>

<style>
  .main-container {
    /* padding: 10px; */
    background-color: #f5f5f5;
  }
</style>
