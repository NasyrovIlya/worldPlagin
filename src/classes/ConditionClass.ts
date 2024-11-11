import type { ArrayClasses, IConditions } from "../SvelteComp/types/interfaces";
import AppItemClass from "./AppItemClass";
import ConditionItemClass from "./ConditionItemClass";
import Field from "./FieldClass";

export default class ConditionClass {
  static conditions: IConditions[] = [];

  static getAppitems(id: AppItemClass | Field | undefined): { id: AppItemClass | Field | undefined; value: string }[] {
    if (id instanceof AppItemClass) {
      return id.items.map((item: AppItemClass | Field) => ({ id: item, value: item.name }));
    } else {
      return [];
    }
  }

  static createNewConditions(mainApp: AppItemClass, path: AppItemClass[], field?: Field) {
    const isHaveMainApp = ConditionClass.conditions.find((item) => item.mainApp.id === mainApp.id);

    if (isHaveMainApp) {
      isHaveMainApp.conditions.push(new ConditionItemClass(path, "", "", field));
      isHaveMainApp.conditions.forEach((item, index) => {
        if (item.betweenConditions === "end" && index !== isHaveMainApp.conditions.length - 1) {
          item.betweenConditions = "and";
        }
      });
    } else {
      ConditionClass.conditions.push({
        mainApp,
        conditions: [new ConditionItemClass(path, "", "", field)],
      });
    }
  }

  static deleteConditionItems(mainApp: AppItemClass, indexCondition: number) {
    const findFromMainApp = ConditionClass.conditions.find((item) => item.mainApp.id === mainApp.id);

    if (findFromMainApp) {
      findFromMainApp.conditions = findFromMainApp?.conditions.filter((_, idx) => idx !== indexCondition && _);

      if (findFromMainApp.conditions.length) {
        findFromMainApp.conditions[findFromMainApp.conditions.length - 1].betweenConditions = "end";
      }
    }
  }

  static async selectFieldFromApp(field: AppItemClass | Field): Promise<ArrayClasses> {
    if (field instanceof AppItemClass && field.items.length === 0) {
      await field.getItems();

      return field.items;
    } else {
      return [];
    }
  }

  static async getConditionString(mainApp: AppItemClass): Promise<string> {
    console.log(ConditionClass.validateConditions(mainApp));

    let result: string = "";
    const conditions = ConditionClass.conditions.filter((item) => item.mainApp.id === mainApp.id);

    if (conditions) {
      conditions.forEach((item) => {
        const conditionItems = item.conditions.map((items) => items.getConditionObject());

        conditionItems.forEach((element) => {
          result = `${result} ${element.conditionString}`;

          if (element.betweenConditions !== "end") {
            if (element.betweenConditions === "elif") {
              result = `${result} %}введите свой текст{% ${element.betweenConditions}`;
            } else {
              result = `${result} ${element.betweenConditions}`;
            }
          }
        });
      });
    }

    result = `{% if ${result} %}Введите необходимый текст{% endif %}`;
    console.log(result);

    return result;
  }

  static validateConditions(mainApp: AppItemClass): boolean {
    let result: boolean = true;
    const conditions = ConditionClass.conditions.filter((item) => item.mainApp.id === mainApp.id);

    if (conditions) {
      conditions.forEach((item) => {
        const mapConditions = item.conditions.map((item) => item.betweenConditions).filter((item) => item === "end");

        if (mapConditions.length !== 1) {
          result = false;
        }
      });
    }

    return result;
  }
}
