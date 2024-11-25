import { get } from "svelte/store";
import { globalStore, isLoad } from "../SvelteComp/Helper/global";

import type { ArrayClasses, IAppItems, IModifier, TypesFields } from "../SvelteComp/types/interfaces";

import AppItemClass from "./AppItemClass";
import { getClassItemFromField, parseNsAppString, replaceFirstOccurrence } from "../SvelteComp/Helper/helper";

export default class Field {
  id: string = "";
  name: string = "";
  type: TypesFields = "STRING";
  single: boolean = true;
  parent: AppItemClass;
  context: any;
  _checked: boolean = false;
  _path: string = "";
  _modificators: IModifier[] = [];

  constructor(id: string, name: string, type: TypesFields, single: boolean, parent: AppItemClass, context: any) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.single = single;
    this.parent = parent;
    this.context = context;
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

  getModificatorStrings(): string {
    let result: string = "";
    let modificatorsItems: string[] = [];

    if (this._modificators.length > 0) {
      for (let index = 0; index < this._modificators.length; index++) {
        const element = this._modificators[index];

        if (element.static === false && element.arguments_description) {
          const reqArguments = element.arguments_description.filter((item) => item.required && !item.value);

          if (reqArguments.length > 0) {
            continue;
          }

          let argumentValues: string = element.id;
          const shablon = element.arguments_description.map((item) => `'${item.name}'`).join(", ");

          modificatorsItems.push(
            replaceFirstOccurrence(
              shablon,
              argumentValues,
              element.arguments_description
                .filter((item) => item.value)
                .map((item) => `'${item.value}'`)
                .join(", ")
            )
          );
        } else {
          modificatorsItems.push(element.id);
        }
      }
    }

    if (modificatorsItems.length > 0) {
      result = `|${modificatorsItems.join("|")}`;
    }

    return result;
  }

  private getSampleStringElma(
    onlyPath: boolean = false,
    isAllPath: boolean = true,
    modificators: boolean = true
  ): string {
    let result = this.id;
    let resultString: string = "";
    let parent: AppItemClass | undefined = this.parent;
    let modificatorsString: string = "";
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

    if (modificators) {
      modificatorsString = this.getModificatorStrings();
    }

    if (isAllPath) {
      resultString = `${path.join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

      return onlyPath ? resultString : `{{ ${resultString} }}`;
    } else {
      resultString = `${path.splice(1).join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

      return onlyPath ? resultString : `{{ ${resultString} }}`;
    }
  }

  private getSampleStringAmo(
    onlyPath: boolean = false,
    isAllPath: boolean = true,
    modificators: boolean = true
  ): string {
    //TODO переделать генерацию шаблонных строк, чтобы вне зависимост от места вызова, генерировался корректный источник поля
    // либо исходя из выбранных параметров генерировать ту или иную шаблонную строку
    let resultString: string = "";
    let parent: AppItemClass | undefined = this.parent;
    let modificatorsString: string = "";
    const path: string[] = [];
    console.log(this.getSource());

    while (parent) {
      if (parent) {
        path.unshift(parent.id);
      }

      parent = parent.parent;
    }

    path.push(this.id);

    if (modificators) {
      modificatorsString = this.getModificatorStrings();
    }

    if (this.single) {
      path.push("value");

      if (isAllPath) {
        resultString = `${path.join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

        return onlyPath ? resultString : `{{ ${resultString} }}`;
      } else {
        resultString = `${path.splice(1).join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

        return onlyPath ? resultString : `{{ ${resultString} }}`;
      }
    } else {
      resultString = `{% for key, value in ${path.splice(1).join(".")}["values"].items() %} {{ value${modificatorsString} }}{% endfor %}`;

      return resultString;
    }
  }

  // возвращает строку пути до поля, с прохождением всех родителей
  getSampleString(onlyPath: boolean = false, isAllPath: boolean = true, modificators: boolean = true): string {
    if (this.parent.entity === "amoCRM") {
      return this.getSampleStringAmo(onlyPath, isAllPath, modificators);
    } else {
      return this.getSampleStringElma(onlyPath, isAllPath, modificators);
    }
    // let result = this.id;
    // let resultString: string = "";
    // let parent: AppItemClass | undefined = this.parent;
    // let modificatorsString: string = "";
    // const path: string[] = [];

    // while (parent) {
    //   if (parent) {
    //     if (parent.entity === "elma") {
    //       const checkId = parseNsAppString(parent.id);

    //       if (Array.isArray(checkId)) {
    //         result = `${checkId[2]}.${result}`;
    //         path.unshift(checkId[2]);
    //       } else {
    //         result = `${parent.id}.${result}`;
    //         path.unshift(parent.id);
    //       }
    //     } else {
    //       result = `${parent.id}.${result}`;
    //       path.unshift(parent.id);
    //     }
    //   }

    //   parent = parent.parent;
    // }

    // path.push(this.id);

    // if (this.parent.entity === "amoCRM") {
    //   path.push("value");
    // }

    // if (modificators) {
    //   modificatorsString = this.getModificatorStrings();
    // }

    // if (isAllPath) {
    //   resultString = `${path.join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

    //   return onlyPath ? resultString : `{{ ${resultString} }}`;
    // } else {
    //   resultString = `${path.splice(1).join(".")}${modificatorsString ? `${modificatorsString}` : ``}`;

    //   return onlyPath ? resultString : `{{ ${resultString} }}`;
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
    if (this.parent?.entity === "elma") {
      return Array.isArray(parseNsAppString(this.id)) ? parseNsAppString(this.id)[2] : this.id;
    } else {
      return this.id;
    }
  }

  // возвращает строку пути по родителям до поля.
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
}
