import { get } from "svelte/store";
import type { ArrayClasses, EntityString, ICfAmo, INameSpaceItems, TypesFields } from "../SvelteComp/types/interfaces";
import { globalStore, isLoad } from "../SvelteComp/Helper/global";
import Field from "./FieldClass";
import { convertFieldType, parseNsAppString, proxyRequestToAmo, wait } from "../SvelteComp/Helper/helper";
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

        AppItemClass.allApps = AppItemClass.allApps.filter((item) => item.entity !== "elma");
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
    } else {
      try {
        const { amo } = get(globalStore);

        if (!amo.id || !amo.token || !amo.url) {
          return;
        }

        isLoad.set(true);

        const leadFields = await proxyRequestToAmo({ ...amo, essence: "leads" });
        await wait(500);
        const contactFields = await proxyRequestToAmo({ ...amo, essence: "contacts" });
        await wait(500);
        const compainesFields = await proxyRequestToAmo({ ...amo, essence: "companies" });

        const mainApp = new AppItemClass(`amoCrm`, "aмо CRM", "amoCRM");

        if (leadFields.length > 0) {
          const leadApp = new AppItemClass(`custom_fields`, "Сделки", "amoCRM", [], mainApp, "SYS_COLLECTION", true, 2);

          mainApp.items.push(leadApp);

          for (let index = 0; index < leadFields.length; index++) {
            const element = leadFields[index];

            if (element.entity_type === "leads") {
              const newSubApp = new Field(
                `${element.id}`,
                element.name,
                convertFieldType(element.type),
                !["multiselect", "select", "radiobutton"].includes(element.type),
                leadApp,
                element.enums ? element.enums.map((item: any) => ({ code: `${item.id}`, name: item.value })) : []
              );
              leadApp.items.push(newSubApp);
            }
          }
        }

        if (contactFields.length > 0) {
          const contactApp = new AppItemClass(`contact`, "Контакты", "amoCRM", [], mainApp, "SYS_COLLECTION", true, 2);
          const contactAppMain = new AppItemClass(
            `main_contact`,
            "Основной контакт",
            "amoCRM",
            [],
            contactApp,
            "SYS_COLLECTION",
            true,
            3
          );
          const contactAppBase = new AppItemClass(
            `contacts`,
            "Контакты",
            "amoCRM",
            [],
            contactApp,
            "SYS_COLLECTION",
            false,
            3
          );
          contactApp.items = [contactAppBase, contactAppMain];
          mainApp.items.push(contactApp);

          for (let index = 0; index < contactFields.length; index++) {
            const element = contactFields[index];

            // const newSubApp = new Field(
            //   `${element.id}`,
            //   element.name,
            //   convertFieldType(element.type),
            //   !["multiselect", "select", "radiobutton"].includes(element.type),
            //   contactApp,
            //   element.enums ? element.enums.map((item: any) => ({ code: `${item.id}`, name: item.value })) : []
            // );
            contactAppMain.items.push(
              new Field(
                `custom_fields.${element.id}`,
                element.name,
                convertFieldType(element.type),
                !["multiselect", "select", "radiobutton"].includes(element.type),
                contactAppMain,
                element.enums ? element.enums.map((item: any) => ({ code: `${item.id}`, name: item.value })) : []
              )
            );
            contactAppBase.items.push(
              new Field(
                `custom_fields.${element.id}`,
                element.name,
                convertFieldType(element.type),
                !["multiselect", "select", "radiobutton"].includes(element.type),
                contactAppBase,
                element.enums ? element.enums.map((item: any) => ({ code: `${item.id}`, name: item.value })) : []
              )
            );
          }
        }

        if (compainesFields.length > 0) {
          const companiesApp = new AppItemClass(
            `company.custom_fields`,
            "Компании",
            "amoCRM",
            [],
            mainApp,
            "SYS_COLLECTION",
            true,
            2
          );

          mainApp.items.push(companiesApp);

          for (let index = 0; index < compainesFields.length; index++) {
            const element = compainesFields[index];

            const newSubApp = new Field(
              `${element.id}`,
              element.name,
              convertFieldType(element.type),
              !["multiselect", "select", "radiobutton"].includes(element.type),
              companiesApp,
              element.enums ? element.enums.map((item: any) => ({ code: `${item.id}`, name: item.value })) : []
            );
            companiesApp.items.push(newSubApp);
          }
        }

        AppItemClass.allApps.push(mainApp);

        isLoad.set(false);
      } catch (error) {
        console.error("Error in getAmoStructure:", error);
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
    if (this.entity === "elma") {
      return Array.isArray(parseNsAppString(this.id)) ? parseNsAppString(this.id)[2] : this.id;
    } else {
      return this.id;
    }
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
      for (let index = 1; index < mainObjArr.length; index++) {
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

    if (this.entity === "elma") {
      const source = this.getSource();
      const appId = this.getId();
      const items = this.items
        .filter((item) => item instanceof Field && item._checked)
        .filter((item) => item instanceof Field);
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
                ${items.map((item) => `{{ ${appId}.${item.getId()}${item.getModificatorStrings()} }}`).join(" ")}
                ${openAppItems.map((app) => app.getStringForApp()).join(" ")}
              {% endfor %}`;
        }
      }

      return result;
    } else {
      const source = this.getSource();
      const appId = this.getId();
      const items = this.items
        .filter((item) => item instanceof Field && item._checked)
        .filter((item) => item instanceof Field);
      const openAppItems: AppItemClass[] = this.items
        .filter((item) => item instanceof AppItemClass && item.isOpen)
        .filter((item) => item instanceof AppItemClass);

      if (items?.length > 0 || openAppItems?.length > 0) {
        if (this.single) {
          result = items.map((item) => `{{ ${item.getId()}.value }}`).join(" ");
          result = `${result} ${openAppItems.map((app) => app.getStringForApp()).join(" ")}`;
        } else {
          result = ` 
              {% for ${appId} in ${appId} %}
                ${items.map((item) => `{{ ${item.getSampleString(true, false, false)}${item.getModificatorStrings()} }}`).join(" ")}
                ${openAppItems.map((app) => app.getStringForApp()).join(" ")}
              {% endfor %}`;
        }
      }

      return result;
    }
  }

  _getStringFor(): string {
    let result: string = "";

    if (this.entity === "elma") {
      const mainParent = this.getPathToMain();
      console.log(mainParent);

      result = mainParent[1].getStringForApp();
    } else {
      const mainParent = this.getPathToMain();

      result = mainParent[2].getStringForApp();
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
