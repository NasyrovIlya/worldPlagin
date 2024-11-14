import { get } from "svelte/store";
import type { ArrayClasses, EntityString, INameSpaceItems, TypesFields } from "../SvelteComp/types/interfaces";
import { globalStore, isLoad } from "../SvelteComp/Helper/global";
import Field from "./FieldClass";
import { parseNsAppString } from "../SvelteComp/Helper/helper";
import { typeOfAppItemClass } from "../SvelteComp/Helper/const";

export default class AppItemClass {
  id: string = "";
  name: string = "";
  items: ArrayClasses = [];
  isOpen: boolean = false;
  parent: AppItemClass | undefined = undefined;
  entity: EntityString = "elma";
  type: TypesFields = "SYS_COLLECTION";
  single: boolean = true;
  level: number = 0;
  _checked: boolean = false;

  constructor(
    id: string,
    name: string,
    entity: EntityString,
    items: ArrayClasses = [],
    parent: AppItemClass | undefined = undefined,
    type: TypesFields = "SYS_COLLECTION",
    single: boolean = true,
    level: number = 1
  ) {
    this.id = id;
    this.name = name;
    this.items = items;
    this.parent = parent;
    this.entity = entity;
    this.type = type;
    this.single = single;
    this.level = level;
  }

  static allApps: AppItemClass[] = [];

  static async getBaseStructure(system: EntityString) {
    if (system === "elma") {
      try {
        const { elma } = get(globalStore);

        AppItemClass.allApps = [];
        isLoad.set(true);
        // eslint-disable-next-line no-undef
        const req = await fetch(`${elma.url}api/extensions/${elma.idIntegration}/script/${elma.getStructureApp}`);

        if (req.ok) {
          const res = await req.json();
          const structure: INameSpaceItems[] = res.body;

          if (structure && structure.length) {
            for (let index = 0; index < structure.length; index++) {
              const element = structure[index];
              const newApp = new AppItemClass(element.id, element.value, "elma");

              if (element.applications?.length > 0) {
                element.applications.forEach((appItem) => {
                  const newSubApp = new AppItemClass(appItem.id, appItem.value, "elma", [], newApp);

                  newSubApp.level = newApp.level + 1;
                  newApp.items.push(newSubApp);
                });
              }

              AppItemClass.allApps.push(newApp);
            }
          }
        } else {
          console.error("Fetch error:", req.statusText);
        }

        isLoad.set(false);
      } catch (error) {
        console.error("Error in getElmaStructure:", error);
        isLoad.set(false);
      }
    }
  }

  // static getLastCheckElement() {
  //   const allOpenElements = AppItemClass.allApps.filter((item) => item.isOpen);

  //   if (allOpenElements.length === 1) {
  //     const mainElement = allOpenElements[0];

  //   }
  // }

  async getItems(): Promise<ArrayClasses> {
    if (this.entity === "elma") {
      if (this.items.length > 0) {
        return this.items;
      } else {
        if (this.parent) {
          const address = parseNsAppString(this.id);

          if (address.length === 3) {
            isLoad.set(true);
            const fields = await Field.getFieldsFromApp(address[0], address[1], this);
            isLoad.set(false);
            this.items = [...fields];

            return this.items;
          }
          const fields = await Field.getFieldsFromApp(this.parent.id, this.id, this);

          this.items = [...fields];
          return this.items;
        }
        return [];
      }
    } else {
      return this.items;
    }
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

  getSampleString(): string {
    let result = this.getId();
    let parent: AppItemClass | undefined = this.parent;

    while (parent) {
      if (parent) {
        const checkParentId = parseNsAppString(parent.id);

        if (Array.isArray(checkParentId)) {
          result = `${checkParentId[2]}.${result}`;
        } else {
          result = `${parent.id}.${result}`;
        }
      }

      parent = parent.parent;
    }

    return result;
  }

  getPathToMain(): AppItemClass[] {
    let path: AppItemClass[] = [this];

    if (!this.parent) {
      return path;
    }

    let parent: AppItemClass | undefined = this.parent;
    path.unshift(parent);

    while (parent?.parent) {
      parent = parent.parent;
      path.unshift(parent);
    }

    return path;
  }

  checked() {
    this._checked = this.items.filter((item) => item._checked).length > 0;
  }

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

  getStringForApp(): string {
    let result = "";
    const source = this.getSource();
    const appId = this.getId();
    const items = this.items.filter((item) => item instanceof Field && item._checked);
    const openAppItems: AppItemClass[] = this.items
      .filter((item) => item instanceof AppItemClass && item.isOpen)
      .filter((item) => item instanceof AppItemClass);

    if (items?.length > 0 || openAppItems?.length > 0) {
      if (this.single) {
        result = items.map((item) => `{{ ${source}.${appId}.${item.getId()} }}`).join(" ");
        result = `${result} ${openAppItems.map((app) => app.getStringForApp()).join(" ")}`;
      } else {
        result = ` 
            {% for ${appId} in ${source}.${appId} %}
              ${items.map((item) => `{{ ${appId}.${item.getId()}${item instanceof Field ? `${item.getModificatorStrings()}` : ``} }}`).join(" ")}
              ${openAppItems.map((app) => app.getStringForApp()).join(" ")}
            {% endfor %}`;
      }
    }

    return result;
  }

  _getStringFor(): string {
    let result: string = "";

    if (this.entity === "elma") {
      const mainParent = this.getPathToMain();
      console.log(mainParent);

      result = mainParent[1].getStringForApp();
    }

    return result;
  }

  // getStringFor(source: string = "", searchMainParent: boolean = true): string {
  //   if (searchMainParent) {
  //     const mainParent = this.getPathToMain();

  //     return mainParent[1].getStringFor("", false);
  //   }

  //   let result: string = "";
  //   let dopField: string[] = [];
  //   const mainName = source ? source : this.getSampleString();
  //   const idName = this.getId();
  //   const parentField = this.items.filter((item) => item._checked).map((item) => item.id);

  //   const parentApp: AppItemClass[] = this.items
  //     .filter((item) => item instanceof AppItemClass)
  //     .filter((item) => item.isOpen && typeOfAppItemClass.includes(item.type))
  //     .filter((item) => item.items.filter((fieldItem) => fieldItem._checked));

  //   parentApp.forEach((item) => {
  //     if (item.single) {
  //       item.items
  //         .filter((field) => field._checked)
  //         .forEach((field) => {
  //           const parentIdName = item.getId();

  //           dopField.push(`{{ ${idName}.${parentIdName}.${field.id} }} `);
  //         });
  //     } else {
  //       dopField.push(item.getStringFor(idName, false));
  //     }
  //   });

  //   if (parentField.length > 0) {
  //     result = `
  //         {% for ${idName} in ${mainName}${source ? `.${idName}` : ""} %}
  //       ${parentField.map((item) => `{{ ${idName}.${item} }}`).join(" ")}
  //       ${dopField.map((item) => item).join(" ")}
  //         {% endfor %} `;
  //   }

  //   return result;
  // }

  checkAll() {
    this.items.forEach((item) => {
      if (typeOfAppItemClass.includes(item.type) === false) {
        item._checked = true;
      }
    });
  }

  clearAll() {
    this.items.forEach((item) => {
      item._checked = false;
    });
  }
}
