import { get } from "svelte/store";
import { globalStore, isLoad } from "../SvelteComp/Helper/global";

import type { ArrayClasses, IAppItems, TypesFields } from "../SvelteComp/types/interfaces";

import AppItemClass from "./AppItemClass";
import { getClassItemFromField, parseNsAppString } from "../SvelteComp/Helper/helper";

export default class Field {
  id: string = "";
  name: string = "";
  type: TypesFields = "STRING";
  single: boolean = true;
  parent: AppItemClass;
  context: any;
  _checked: boolean = false;
  _path: string = "";

  constructor(id: string, name: string, type: TypesFields, single: boolean, parent: AppItemClass, context: any) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.single = single;
    this.parent = parent;
    this.context = context;
  }

  async getChildFields(): Promise<Field[]> {
    return [];
  }

  static async getFieldsFromApp(ns: string, app: string, owner: AppItemClass): Promise<ArrayClasses> {
    function filterObjects(array: any) {
      const arrayFilter = array.filter(
        (element: any) =>
          ["__id", "__name", "__status", "__file", "__createdAt"].includes(element.id) || !element.id.startsWith("__")
      );

      return arrayFilter;
    }

    const result: ArrayClasses = [];
    const { elma } = get(globalStore);

    isLoad.set(true);
    // eslint-disable-next-line no-undef
    const getStr = await fetch(`${elma.url}api/extensions/${elma.idIntegration}/script/${elma.getFieldsApp}`, {
      method: "POST",
      body: JSON.stringify({
        ns,
        app,
      }),
    });

    if (getStr.ok) {
      const respStr = await getStr.json();

      if (respStr.success) {
        const filterFields: IAppItems[] = [...filterObjects([...respStr.body])];

        if (filterFields.length > 0) {
          filterFields.forEach((field) => {
            result.push(getClassItemFromField(field, owner));
          });
        }
      }
    }

    isLoad.set(false);
    return result;
  }

  // возвращает строку пути до поля, с прохождением всех родителей
  getSampleString(onlyPath: boolean = false, isAllPath: boolean = true): string {
    let result = this.id;
    let parent: AppItemClass | undefined = this.parent;
    const path: string[] = [];

    while (parent) {
      if (parent) {
        const checkId = parseNsAppString(parent.id);

        if (Array.isArray(checkId)) {
          result = `${checkId[2]}.${result}`;
          path.unshift(checkId[2]);
        } else {
          result = `${parent.id}.${result}`;
          path.unshift(parent.id);
        }
      }

      parent = parent.parent;
    }

    path.push(this.id);

    if (isAllPath) {
      return onlyPath ? path.join(".") : `{{ ${path.join(".")} }}`;
    } else {
      return onlyPath ? path.splice(1).join(".") : `{{ ${path.splice(1).join(".")} }}`;
    }

    // if (onlyPath) {
    //   return result;
    // } else {
    //   return `{{ ${result} }}`;
    // }
  }

  isParentSingle(): boolean {
    let result: boolean = true;
    let parent: AppItemClass | undefined = this.parent;

    while (parent) {
      if (parent) {
        if (parent.single === false) {
          return false;
        }
      }

      parent = parent.parent;
    }
    return result;
  }

  getId(): string {
    return Array.isArray(parseNsAppString(this.id)) ? parseNsAppString(this.id)[2] : this.id;
  }

  // возвращает строку пути по родителям до поля.
  getSource(): string {
    let result: string = "";

    const parent = this.parent;
    const mainObjArr = parent?.getPathToMain();

    if (mainObjArr && mainObjArr.length > 0) {
      for (let index = 0; index < mainObjArr.length; index++) {
        const element = mainObjArr[index];

        if (element.single) {
          result = result ? `${result}.${element.getId()}` : element.getId();
        } else {
          result = element.getId();
        }
      }
    }

    return result;
  }
}
