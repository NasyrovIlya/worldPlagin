/* eslint-disable no-case-declarations */
import { get } from "svelte/store";
import AppItemClass from "../../classes/AppItemClass";
import Field from "../../classes/FieldClass";
import type { IAppItems, ICfAmo, IResponceModifier, TConditionString, TShablonTypeAmo, TypesFields } from "../types/interfaces";
import { dictionaryTerms } from "./const";
import { globalStore, isLoad, modifiersResp } from "./global";

export const fieldTypeDictionary: { id: TypesFields; value: string }[] = [
  { id: "STRING", value: "Строка" },
  { id: "ENUM", value: "Категория" },
  { id: "SYS_COLLECTION", value: "Приложение" },
  { id: "FLOAT", value: "Число" },
  { id: "BOOLEAN", value: "Да/Нет" },
  { id: "FILE", value: "Файл" },
  { id: "DATETIME", value: "Дата" },
  { id: "STATUS", value: "Статус" },
  { id: "SYS_USER", value: "Пользователь" },
  { id: "EMAIL", value: "Почта" },
  { id: "PHONE", value: "Телефон" },
  { id: "FULL_NAME", value: "ФИО" },
  { id: "JSON", value: "JSON" },
  { id: "MONEY", value: "Деньги" },
  { id: "TABLE", value: "Таблица" },
];

export function filterObjects(array: any) {
  const arrayFilter = array.filter(
    (element: any) =>
      ["__id", "__name", "__status", "__file", "__createdAt"].includes(element.id) || !element.id.startsWith("__")
  );

  return arrayFilter.map((item: any) => ({ ...item, _checked: false }));
}

export async function insertText(inputText: string) {
  // eslint-disable-next-line no-undef
  return Word.run(async (context) => {
    try {
      const selection = context.document.getSelection();

      // eslint-disable-next-line no-undef
      selection.insertText(inputText, Word.InsertLocation.replace);

      const range = selection.getRange("After");

      range.select();
      isLoad.set(true);
      await context.sync();
      isLoad.set(false);
    } catch (error) {
      console.log("Error: " + error);
      // eslint-disable-next-line no-undef
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
      isLoad.set(false);
    }
  });
}

export function getNameType(type: TypesFields): string {
  let result = fieldTypeDictionary.find((item: any) => item.id === type)?.value;

  return result ? result : "";
}

export function parseNsAppString(input: string): string[] | string {
  if (input.includes(".")) {
    return input.split(".");
  } else {
    return input;
  }
}

export function getClassItemFromField(item: IAppItems, owner: AppItemClass): AppItemClass | Field {
  switch (item.type) {
    case "SYS_COLLECTION":
      return new AppItemClass(
        `${item.parents!.ns}.${item.parents!.code}.${item.id}`,
        item.name,
        "elma",
        [],
        owner,
        item.type,
        item.single,
        owner.level + 1
      );
    case "TABLE":
      const fieldTable: IAppItems[] = item.context ? item.context : [];

      if (fieldTable.length > 0) {
        const fieldItem = new AppItemClass(
          `${item.id}`,
          item.name,
          "elma",
          [],
          owner,
          item.type,
          false,
          owner.level + 1
        );

        for (let index = 0; index < fieldTable.length; index++) {
          const element = fieldTable[index];

          fieldItem.items.push(getClassItemFromField(element, fieldItem));
        }
        return fieldItem;
      }

      return new Field(item.id, item.name, item.type, item.single, owner, item.context);
    // case "ENUM":
    //   const enumItem = new AppItemClass(
    //     `${item.id}`,
    //     item.name,
    //     "elma",
    //     [],
    //     owner,
    //     item.type,
    //     item.single,
    //     owner.level + 1
    //   );

    //   enumItem.items.push(new Field("code", "Код", "STRING", true, enumItem, item.context));
    //   enumItem.items.push(new Field("name", "Имя", "STRING", true, enumItem, item.context));

    //   return enumItem;
    case "SYS_USER":
      const userItem = new AppItemClass(
        `${item.id}`,
        item.name,
        "elma",
        [],
        owner,
        item.type,
        item.single,
        owner.level + 1
      );

      userItem.items.push(new Field("name", "ФИО", "STRING", item.single, userItem, item.context));
      userItem.items.push(new Field("positions", "Должность", "STRING", item.single, userItem, item.context));

      return userItem;
    case "STATUS":
      const statusItem = new AppItemClass(
        `${item.id}`,
        item.name,
        "elma",
        [],
        owner,
        item.type,
        item.single,
        owner.level + 1
      );

      statusItem.items.push(new Field("code", "Код", "STRING", item.single, statusItem, item.context));
      statusItem.items.push(new Field("name", "Имя", "STRING", item.single, statusItem, item.context));

      return statusItem;
    default:
      return new Field(item.id, item.name, item.type, item.single, owner, item.context);
  }
}

export function getTypeValueCondition(nameCondition: TConditionString) {
  return dictionaryTerms.find((item) => item.id === nameCondition)?.type;
}

export function loadSimulattion(time: number = 300) {
  isLoad.set(true);

  setTimeout(() => {
    isLoad.set(false);
  }, time);
}

function formatUrl(url: string) {
  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  } else if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
}

export async function getModifiers(): Promise<IResponceModifier | {}> {
  try {
    const modifierFromStore = get(modifiersResp);

    if (modifierFromStore && Object.keys(modifierFromStore)?.length > 0) {
      return modifierFromStore;
    } else {
      const url = get(globalStore).cd.url;

      if (url) {
        isLoad.set(true);
        const req = await fetch(`${formatUrl(url)}/modifiers`, {
          method: "GET",
        });

        if (req.ok) {
          const resp = await req.json();
          modifiersResp.set(resp);

          isLoad.set(false);
          return get(modifiersResp);
        }

        isLoad.set(false);
      }
    }
  } catch (error) {
    console.log(error);
  }

  isLoad.set(false);
  return {};
}

export function scrollToElementById(id: string): void {
  loadSimulattion(500);

  setTimeout(() => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 0);
}

export function replaceFirstOccurrence(target: string, str: string, replacement: string): string {
  const index = str.indexOf(target);
  if (index !== -1) {
    return str.slice(0, index) + replacement + str.slice(index + target.length);
  }
  return str; // Возвращает str, если target не найден
}

export function convertFieldType(amoTypeField: TShablonTypeAmo): TypesFields {
  const shalon: TShablonTypeAmo[] = [
    "text",
    "numeric",
    "checkbox",
    "select",
    "multiselect",
    "date",
    "url",
    "textarea",
    "radiobutton",
    "streetaddress",
    "smart_address",
    "birthday",
    "legal_entity",
    "date_time",
    "tracking_data",
    "file",
    "monetary",
  ];

  if (shalon.includes(amoTypeField)) {
    switch (amoTypeField) {
      case "birthday":
        return "DATETIME";
      case "checkbox":
        return "BOOLEAN";
      case "date":
        return "DATETIME";
      case "date_time":
        return "DATETIME";
      case "file":
        return "FILE";
      case "legal_entity":
        return "ENUM";
      case "monetary":
        return "MONEY";
      case "multiselect":
        return "ENUM";
      case "numeric":
        return "FLOAT";
      case "radiobutton":
        return "ENUM";
      case "select":
        return "ENUM";
      case "smart_address":
        return "ENUM";
      case "streetaddress":
        return "STRING";
      case "text":
        return "STRING";
      case "textarea":
        return "STRING";
      case "tracking_data":
        return "DATETIME";
      case "url":
        return "STRING";
      default:
        return "STRING";
    }
  } else {
    return "STRING";
  }
}

export async function proxyRequestToAmo(arg: any): Promise<ICfAmo[]> {
  let result: ICfAmo[] = [];

  if (arg.id && arg.url && arg.token) {
    try {
      let url = `https://elma-dev.certit.ru/api/extensions/7c1dbebe-2d99-4939-965e-d1134b12b37c/script/requeststoamo`;
      // eslint-disable-next-line no-undef
      const req = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          id: arg.id,
          url: `${arg.url}api/v4/${arg.essence}/custom_fields`,
          token: arg.token,
          method: "GET",
          body: null,
        }),
      });

      if (req.ok) {
        const res = await req.json();
        const customFieldArr: ICfAmo[] = res.body._embedded.custom_fields.filter(
          (item: any) => item.is_api_only === false
        );

        result = customFieldArr;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return result;
}

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
