import Field from "../../classes/FieldClass";
import { type TConditionString, type IMenuItems, type TConditionBetween, ETypeOfFieldValue } from "../types/interfaces";

export const typeOfAppItemClass = ["SYS_COLLECTION", "TABLE", "STATUS", "SYS_USER", "FULL_NAME"];

function callBackConstructor(arg: Field | any) {
  return arg;
}

export const constructorBurgerItem: IMenuItems[] = [
  {
    id: "postTest",
    value: "Вставить шаблонную строку",
    callback: callBackConstructor,
  },
  {
    id: "constractionId",
    value: "Создавть условие с полем",
    callback: callBackConstructor,
  },
  {
    id: "modifier",
    value: "Выбрать модификатор",
    callback: callBackConstructor,
  },
];

export const dictionaryTerms: { id: TConditionString; value: string; type: ETypeOfFieldValue[] }[] = [
  {
    id: "Equals",
    value: "Равняется",
    type: [
      ETypeOfFieldValue.string,
      ETypeOfFieldValue.number,
      ETypeOfFieldValue.date,
      ETypeOfFieldValue.enum,
      ETypeOfFieldValue.boolean,
    ],
  },
  {
    id: "NoEquals",
    value: "Не равняется",
    type: [
      ETypeOfFieldValue.string,
      ETypeOfFieldValue.number,
      ETypeOfFieldValue.date,
      ETypeOfFieldValue.enum,
      ETypeOfFieldValue.boolean,
    ],
  },
  {
    id: "OneOf",
    value: "Хотя бы один",
    type: [ETypeOfFieldValue.enum],
  },
  {
    id: "None",
    value: "Ни один",
    type: [ETypeOfFieldValue.enum],
  },
  {
    id: "More",
    value: "Больше",
    type: [ETypeOfFieldValue.number, ETypeOfFieldValue.date],
  },
  {
    id: "Less",
    value: "Меньше",
    type: [ETypeOfFieldValue.number, ETypeOfFieldValue.date],
  },
  {
    id: "GreateOrEqual",
    value: "Больше или равно",
    type: [ETypeOfFieldValue.number, ETypeOfFieldValue.date],
  },
  {
    id: "LessOrEqual",
    value: "Меньше ли равно",
    type: [ETypeOfFieldValue.number, ETypeOfFieldValue.date],
  },
];

export const betweenConditions: { id: TConditionBetween; value: string }[] = [
  {
    id: "and",
    value: "И",
  },
  {
    id: "or",
    value: "Или",
  },
  {
    id: "elif",
    value: "Иначе если",
  },
  // {
  //   id: "end",
  //   value: "Конец",
  // },
];

export const options: { label: string; value: string }[] = [
  { label: "Настройки соединения", value: "connect-settings" },
  { label: "Шаблонные строки из amoCRM", value: "amoCrmStrings" },
  { label: "Шаблонные строки из Elma", value: "elmaStrings" },
  { label: "Модификаторы ЦД", value: "modifiers" },
];
