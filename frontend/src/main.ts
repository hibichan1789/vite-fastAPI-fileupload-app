// src/main.ts
import { fetchFileAll, postFileAsync, downloadAsync} from "./api/fetchApi";
import { renderTable } from "./dom/render";
import { validateInputFiles, validateFile, getDownloadId } from "./utils/fileUtils";

const statusPara = document.querySelector("#upload-status") as HTMLParagraphElement;
const uploadButton = document.querySelector("#upload-button") as HTMLButtonElement;
const inputFile = document.querySelector("#input-file") as HTMLInputElement;
const fileArea = document.querySelector("#file-area") as HTMLDivElement;

async function render(){
  const fileResponses = await fetchFileAll();
  renderTable(fileArea, fileResponses);
  const downloadButtons = fileArea.querySelectorAll(".download-button");
  downloadButtons.forEach(downloadButton=>{
    downloadButton.addEventListener("click", async ()=>{
      const downloadId = getDownloadId(downloadButton.id);
      await downloadAsync(downloadId);
    });
  });
}
async function init(){
  if(!statusPara||!uploadButton||!inputFile||!fileArea){
    console.error("読み込みに失敗しました");
    return;
  }
  await render();
}
const MaxMB = 10;
uploadButton.addEventListener("click",async (event)=>{
  event.preventDefault();
  uploadButton.disabled = true;
  statusPara.textContent = "送信中";
  const uploadFiles = inputFile.files;
  if(!validateInputFiles(uploadFiles)){
    statusPara.textContent = "ファイルを選択してください";
    console.error("ファイルを選択してください");
    uploadButton.disabled = false;
    return;
  }
  const uploadFile = (uploadFiles as FileList)[0];
  if(!validateFile(uploadFile, MaxMB)){
    statusPara.textContent = "ファイルが不適切です";
    console.error("ファイルが不適切です");
    uploadButton.disabled = false;
    return;
  }
  try{
    await postFileAsync(uploadFile);
    statusPara.textContent = "アップロードに成功しました";
    inputFile.value = "";
    render();
  }
  catch(error){
    statusPara.textContent = "アップロードに失敗しました";
    console.error("アップロードに失敗しました", error);
  }
  finally{
    uploadButton.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", init);