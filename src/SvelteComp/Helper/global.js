import { writable } from "svelte/store";

export const globalStore = writable({
  elma: {
    link: "",
  },
  amo: {
    link: "",
  },
});
