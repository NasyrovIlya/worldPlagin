import type AppItemClass from "./AppItemClass";
import type { IConditionObject, TConditionBetween, TConditionString } from "../SvelteComp/types/interfaces";

import { dictionaryTerms } from "../SvelteComp/Helper/const";
import { ETypeOfFieldValue } from "../SvelteComp/types/interfaces";

import Field from "./FieldClass";

export default class ConditionItemClass {
  path: AppItemClass[];
  field: Field | undefined;
  condition: TConditionString | "";
  value: any;
  betweenConditions?: TConditionBetween;

  constructor(
    path: AppItemClass[],
    condition: TConditionString | "",
    value: any,
    field?: Field,
    betweenConditions?: TConditionBetween
  ) {
    this.path = path;
    this.condition = condition;
    this.value = value;
    this.betweenConditions = betweenConditions ? betweenConditions : "end";

    if (field) {
      this.field = field;
    } else {
      this.field = undefined;
    }
  }

  getConditionFromField(): { id: TConditionString; value: string }[] {
    const typeField = this.field?.type;

    switch (typeField) {
      case "FLOAT":
      case "MONEY":
        return dictionaryTerms.filter((item) => item.type.includes(2));
      case "STRING":
        return dictionaryTerms.filter((item) => item.type.includes(1));
      case "ENUM":
        return dictionaryTerms.filter((item) => item.type.includes(4));
      case "BOOLEAN":
        return dictionaryTerms.filter((item) => item.type.includes(5));
      case "EMAIL":
      case "PHONE":
        return dictionaryTerms.filter((item) => item.type.includes(1));
      case "DATETIME":
        return dictionaryTerms.filter((item) => item.type.includes(3));
      default:
        break;
    }

    return [];
  }

  getNumberFromTypeField(): ETypeOfFieldValue {
    const typeField = this.field?.type;

    switch (typeField) {
      case "FLOAT":
      case "MONEY":
        return ETypeOfFieldValue.number;
      case "BOOLEAN":
        return ETypeOfFieldValue.boolean;
      case "EMAIL":
      case "PHONE":
      case "STRING":
        return ETypeOfFieldValue.string;
      case "DATETIME":
        return ETypeOfFieldValue.date;
      case "ENUM":
        return ETypeOfFieldValue.enum;
      default:
        return ETypeOfFieldValue.string;
    }
  }

  getContextField(): { id: any; value: string }[] {
    if (this.field?.context.length) {
      if (this.field?.parent.entity === "elma") {
        return this.field?.context.map((item: any) => ({ id: item.name, value: item.name }));
      } else {
        return this.field?.context.map((item: any) => ({ id: item.code, value: item.name }));
      }
    }
    return [];
  }

  clearField() {
    this.field = undefined;
    this.condition = "";
    this.value = "";
  }

  private getConditionObjectElma(): IConditionObject {
    const condition = this.condition;
    let fieldPath = "";
    let conditionIcon: string = "";
    let conditionString: string = "";
    let value = `"${this.value}"`;

    if (this.field) {
      const field = this.field;

      if (field.isParentSingle()) {
        fieldPath = field.getSampleString(true, false, false);
      } else {
        fieldPath = `${field.getSource()}.${this.field.getId()}`;
      }
    }

    switch (condition) {
      case "Equals":
        conditionIcon = "==";
        break;
      case "GreateOrEqual":
        conditionIcon = ">=";
        break;
      case "Less":
        conditionIcon = "<";
        break;
      case "LessOrEqual":
        conditionIcon = "<=";
        break;
      case "More":
        conditionIcon = ">";
        break;
      case "NoEquals":
        conditionIcon = "!=";
        break;
      case "None":
        conditionIcon = "not in";
        value = `[${this.value.map((item: any) => `"${item}"`).join(", ")}]`;
        break;
      case "OneOf":
        conditionIcon = "in";
        value = `[${this.value.map((item: any) => `"${item}"`).join(", ")}]`;
        break;
      default:
        conditionIcon = "==";
        break;
    }

    conditionString = `${fieldPath} ${conditionIcon} ${value}`;

    const result = {
      fieldPath,
      conditionIcon,
      value: this.value,
      betweenConditions: this.betweenConditions,
      conditionString,
    };

    return result;
  }

  private getConditionObjectAmo(): IConditionObject {
    const condition = this.condition;
    let fieldPath = "";
    let conditionIcon: string = "";
    let conditionString: string = "";
    let value = `"${this.value}"`;

    if (this.field) {
      const field = this.field;

      fieldPath = `${field.parent.getId()}.${this.field.getId()}`;
    }

    switch (condition) {
      case "Equals":
        conditionIcon = "==";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "GreateOrEqual":
        conditionIcon = ">=";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "Less":
        conditionIcon = "<";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "LessOrEqual":
        conditionIcon = "<=";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "More":
        conditionIcon = ">";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "NoEquals":
        conditionIcon = "!=";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
      case "None":
        conditionIcon = "not in";
        value = `${this.value.map((item: any) => `${item} ${conditionIcon} ${fieldPath}['values']`).join(" and ")}`;
        conditionString = `not ${fieldPath} or (${value})`;
        break;
      case "OneOf":
        conditionIcon = "in";
        value = `${this.value.map((item: any) => `${item} ${conditionIcon} ${fieldPath}['values']`).join(" or ")}`;
        conditionString = `${fieldPath} and (${value})`;
        break;
      default:
        conditionIcon = "==";
        conditionString = `${fieldPath} ${conditionIcon} ${value}`;
        break;
    }

    const result = {
      fieldPath,
      conditionIcon,
      value: this.value,
      betweenConditions: this.betweenConditions,
      conditionString,
    };

    return result;
  }

  getConditionObject(): IConditionObject {
    if (this.field) {
      const field = this.field;

      if (field.parent.entity === "elma") {
        return this.getConditionObjectElma();
      } else {
        return this.getConditionObjectAmo();
      }
    } else {
      return this.getConditionObjectElma();
    }
  }
}
