/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */
// import { getHtmlStructureJSON } from "./ParseJSON";
import MainSvelte from "../SvelteComp/Main.svelte";

Office.onReady(() => {
  new MainSvelte({
    target: document.getElementById("app-start"),
  });
});

export async function run(someTest = "") {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    if (someTest === "") {
      someTest = "Hellow World";
    }
    const paragraph = context.document.body.insertParagraph(someTest, Word.InsertLocation.end);

    // change the paragraph color to blue.
    paragraph.font.color = "blue";

    await context.sync();
  });
}
