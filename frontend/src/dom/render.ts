// src/dom/render.ts
import type { FileResponse } from "../interfaces/file";
import { createTableHeader, createTableDescription } from "./table";
export function renderTable(tableArea:HTMLDivElement, fileResponses:FileResponse[]):void{
    tableArea.innerHTML = "";
    const table = document.createElement("table");
    const thead = createTableHeader();
    const tbody = document.createElement("tbody");
    fileResponses.forEach(fileResponse => {
        const tableDescription = createTableDescription(fileResponse);
        tbody.appendChild(tableDescription);
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    tableArea.appendChild(table);
}
