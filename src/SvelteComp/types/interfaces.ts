import type AppItemClass from "../../classes/AppItemClass";
import type ConditionItemClass from "../../classes/ConditionItemClass";
import type Field from "../../classes/FieldClass";

export interface IMainObject {
  objectName: string;
  isOpen: boolean;
  parents: IMainObject[];
}

export interface INameSpaceItems {
  id: string;
  value: string;
  applications: {
    id: string;
    value: string;
  }[];
  isOpen?: boolean;
}

export type TypesFields =
  | "STRING"
  | "ENUM"
  | "SYS_COLLECTION"
  | "FLOAT"
  | "BOOLEAN"
  | "DATETIME"
  | "EMAIL"
  | "FILE"
  | "STATUS"
  | "SYS_USER"
  | "JSON"
  | "EMAIL"
  | "PHONE"
  | "FULL_NAME"
  | "MONEY"
  | "TABLE";

export interface IAppItems {
  id: string;
  name: string;
  type: TypesFields;
  single: boolean;
  parents?: IAppPath;
  context?: any;
  _checked: boolean;
}

export interface IAppPath {
  ns: string;
  code: string;
}

export interface IGlobalStore {
  elma: {
    idIntegration: string;
    url: string;
    getStructureApp: string;
    getFieldsApp: string;
  };
  amo: {
    url: string;
    id: string;
    token: string;
  };
  cd: {
    url: string;
  };
}

export interface EnumField {
  code: string;
  name: string;
}

export type ArrayClasses = (AppItemClass | Field)[];

export type EntityString = "elma" | "amoCRM";

export type TConditionBetween = "and" | "or" | "elif" | "end";

export interface IConditions {
  mainApp: AppItemClass;
  conditions: ConditionItemClass[];
}

export interface IMenuItems {
  id: string;
  value: string;
  callback: (arg: AppItemClass | Field | any) => any;
}

export type TConditionString =
  | "Equals"
  | "NoEquals"
  | "LessOrEqual"
  | "GreateOrEqual"
  | "Less"
  | "More"
  | "OneOf"
  | "None";

export enum ETypeOfFieldValue {
  "string" = 1,
  "number" = 2,
  "date" = 3,
  "enum" = 4,
  "boolean" = 5,
}

export type TShablonTypeAmo =
  | "text"
  | "numeric"
  | "checkbox"
  | "select"
  | "multiselect"
  | "date"
  | "url"
  | "textarea"
  | "radiobutton"
  | "streetaddress"
  | "smart_address"
  | "birthday"
  | "legal_entity"
  | "date_time"
  | "tracking_data"
  | "file"
  | "monetary";

export interface IDropDownItem {
  id: any;
  value: string;
  group?: IDropDownGroup;
}

interface IDropDownGroup {
  id: string | number;
  value: string;
}

export interface IDropDownFormattedGroup {
  id: string | number;
  value: string;
  _checkedCount: number;
  _showed: boolean;
}

export interface IDropDownFormattedItem {
  id: any;
  value: string;
  group?: IDropDownFormattedGroup;
  _key: string;
  _checked: boolean;
  _original: ISuggestItem;
}

interface ISuggestItem {
  id: any;
  value: string;
}

export interface IConditionObject {
  fieldPath?: string;
  conditionIcon: string;
  value: any;
  betweenConditions?: TConditionBetween;
  conditionString: string;
}

export interface IResponceModifier {
  [name: string]: {
    arguments_description: IArgumentsDescription[];
    modifier_description: string;
    name: string;
    static: boolean;
    usage_example: string;
  };
}

export interface IArgumentsDescription {
  description: string;
  name: string;
  required: boolean;
  values: {
    value: string;
    description?: string;
  }[];
  value?: any;
}

export interface IModifier {
  id: string;
  arguments_description: IArgumentsDescription[];
  modifier_description: string;
  name: string;
  static: boolean;
  usage_example: string;
  showArguments?: boolean;
}

export interface ICfAmo {
  account_id: number;
  code: string;
  entity_type: string;
  enums: any;
  hidden_statuses: any[];
  id: number;
  is_predefined: boolean;
  name: string;
  type: TShablonTypeAmo;
}
