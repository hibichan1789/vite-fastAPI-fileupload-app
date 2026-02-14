import type { FileResponse } from "../interfaces/file";
import { reshapeBite, reshapeDate } from "../utils/fileUtils";
export function createTableHeader():HTMLTableSectionElement{
    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    //FileResponseのプロパティの数分thを作成 
    const ths = [
        createCell("th", "ファイル名", "file-name"),
        createCell("th", "ファイルサイズ(MB)"),
        createCell("th", "MIME TYPE", "content-type"),
        createCell("th", "アップロード日"),
        createCell("th", ""),
        createCell("th", "")
    ]
    ths.forEach(th=>theadRow.appendChild(th));
    thead.appendChild(theadRow);
    return thead;
}
export function createTableDescription(fileResponse:FileResponse):HTMLTableRowElement{
    const tbodyRow = document.createElement("tr");
    
    
    const tds = [
        createCell("td", fileResponse.original_name, "file-name"),
        createCell("td", reshapeBite(fileResponse.file_size)),
        createCell("td", fileResponse.content_type, "content-type"),
        createCell("td", reshapeDate(fileResponse.uploaded_at)),
        createButtonCell(fileResponse.id, "download"),
        createButtonCell(fileResponse.id, "delete")
    ]
    tds.forEach(td => tbodyRow.appendChild(td));
    return tbodyRow;
}
function createCell(tag:"th"|"td",cellText:string|number, className?:string):HTMLTableCellElement{
    const cell = document.createElement(tag);
    cell.textContent = String(cellText);
    if(className){
        cell.classList.add(className);
    }
    return cell;
}
function createButtonCell(id:number, prefix:"download"|"delete"):HTMLTableCellElement{
    const downloadButtonCell = document.createElement("td");
    downloadButtonCell.classList.add("button-area")
    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.id = `${prefix}-button-${id}`;
    downloadButton.classList.add(`${prefix}-button`, "table-button", "button");
    downloadButton.textContent = prefix==="download"? "ダウンロード" : "削除";
    downloadButtonCell.appendChild(downloadButton);
    return downloadButtonCell;
}