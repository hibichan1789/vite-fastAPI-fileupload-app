import type { FileResponse } from "../interfaces/file";
import { reshapeBite, reshapeDate } from "../utils/fileUtils";
export function createTableHeader():HTMLTableSectionElement{
    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    //FileResponseのプロパティの数分thを作成 
    const ths = [
        createCell("th", "ファイル名"),
        createCell("th", "ファイルサイズ(MB)"),
        createCell("th", "MIME TYPE"),
        createCell("th", "アップロード日"),
        createCell("th", "")
    ]
    ths.forEach(th=>theadRow.appendChild(th));
    thead.appendChild(theadRow);
    return thead;
}
export function createTableDescription(fileResponse:FileResponse):HTMLTableRowElement{
    const tbodyRow = document.createElement("tr");
    
    
    const tds = [
        createCell("td", fileResponse.original_name),
        createCell("td", reshapeBite(fileResponse.file_size)),
        createCell("td", fileResponse.content_type),
        createCell("td", reshapeDate(fileResponse.uploaded_at)),
        createDownloadCell(fileResponse.id)
    ]
    tds.forEach(td => tbodyRow.appendChild(td));
    return tbodyRow;
}
function createCell(tag:"th"|"td",cellText:string|number):HTMLTableCellElement{
    const th = document.createElement(tag);
    th.textContent = String(cellText);
    return th;
}
function createDownloadCell(id:number):HTMLTableCellElement{
    const downloadButtonCell = document.createElement("td");
    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.id = `download-button-${id}`;
    downloadButton.textContent = "ダウンロード";
    downloadButtonCell.appendChild(downloadButton);
    return downloadButtonCell;
}