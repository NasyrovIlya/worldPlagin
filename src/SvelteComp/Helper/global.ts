import { writable } from "svelte/store";
import type { IGlobalStore, IResponceModifier } from "../types/interfaces";
import type { Writable } from "svelte/store";
import type Field from "../../classes/FieldClass";

export const globalStore: Writable<IGlobalStore> = writable({
  elma: {
    idIntegration: ``,
    url: ``,
    getStructureApp: "",
    getFieldsApp: "",
  },
  amo: {
    url: "",
  },
  cd: {
    url: "api-centerdoc.certit.ru",
  },
});

export const currentSetting = writable("connect-settings");

export let isLoad: Writable<boolean> = writable(false);

export let fieldModifier: Writable<Field | undefined> = writable();
export let modifiersResp: Writable<IResponceModifier | {}> = writable({});
