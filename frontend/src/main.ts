// src/main.ts
import { fetchFileAll, postFileAsync, downloadAsync, deleteAsync} from "./api/fetchApi";
import { renderTable } from "./dom/render";
import { validateInputFiles, validateFile, getDownloadId } from "./utils/fileUtils";

const statusPara = document.querySelector("#upload-status") as HTMLParagraphElement;
const uploadButton = document.querySelector("#upload-button") as HTMLButtonElement;
const inputFile = document.querySelector("#input-file") as HTMLInputElement;
const fileArea = document.querySelector("#file-area") as HTMLDivElement;
const uploadArea = document.querySelector(".upload-area") as HTMLDivElement;
//テーブルのDOM描画関数
async function render(){
  const fileResponses = await fetchFileAll();
  renderTable(fileArea, fileResponses);
}
//初期化関数
async function init(){
  if(!statusPara||!uploadButton||!inputFile||!fileArea||!inputFile||!uploadArea){
    console.error("読み込みに失敗しました");
    return;
  }
  await render();
}
//ダウンロード、削除ボタンのイベント処理
fileArea.addEventListener("click",async (event)=>{
  console.log(event.target);
  const target = event.target as HTMLElement;
  const button = target.closest("button");
  if(!button){
    return;
  }
  const id = getDownloadId(button.id);
  console.log(id);
  const buttonClassList = button.classList;
  if(buttonClassList.contains("delete-button")){
    try{
        await deleteAsync(id);
        await render();
    }
    catch(error){
      console.error("削除に失敗しました", error);
      window.alert("削除に失敗しました");
    }
    finally{
      return;
    }
  }
  if(buttonClassList.contains("download-button")){
    try{
        await downloadAsync(id);
    }
    catch(error){
      console.error("ダウンロードに失敗しました", error);
      window.alert("ダウンロードに失敗しました");
    }
    finally{
      return;
    }
  }
});
let fileState:File|null = null
//ファイルを入れた時のイベント処理
inputFile.addEventListener("change", ()=>{
  if(!validateInputFiles(inputFile.files)){
    statusPara.textContent = "ファイルを選択してください";
    console.error("ファイルを選択してください");
    return;
  }
  const uploadFile = (inputFile.files as FileList)[0]
  if(!validateFile(uploadFile, MaxMB)){
    statusPara.textContent = "ファイルが不適切です";
    console.error("ファイルが不適切です");
    uploadButton.disabled = false;
    return;
  }
  fileState = uploadFile;
  statusPara.textContent = fileState.name;
});
//ドラッグoverイベント
uploadArea.addEventListener("dragover", (event)=>{
  event.preventDefault();
  uploadArea.classList.add("dragover");
  statusPara.textContent = "ここにドロップしてください";
});
uploadArea.addEventListener("dragleave", (event)=>{
  console.log("dragleave");
  uploadArea.classList.remove("dragover");
  statusPara.textContent = fileState ? fileState.name : "ファイルを選択またはドロップアンドドロップしてください";
});
uploadArea.addEventListener("drop", (event:DragEvent)=>{
    event.preventDefault();
    uploadArea.classList.remove("dragover");
    const uploadFiles = event.dataTransfer?.files;
    if(!uploadFiles){
        return;
    }
    if(!validateInputFiles(uploadFiles)){
      return;
    }
    const uploadFile = uploadFiles[0] as File;
    fileArea.classList.remove("dragover");
    console.log(uploadFile);
    if(!validateFile(uploadFile, MaxMB)){
        statusPara.textContent = "ファイルが不適切です";
        return;
    }
    fileState = uploadFile;
    statusPara.textContent = fileState.name;
});
// アップロードボタンを押したときのイベント処理
const MaxMB = 10;
uploadButton.addEventListener("click",async (event)=>{
  event.preventDefault();
  uploadButton.disabled = true;
  if(fileState === null){
    uploadButton.disabled = false;
    console.error("ファイルが選択されてません");
    statusPara.textContent = "ファイルが選択されてません";
    return;
  }
  statusPara.textContent = "送信中";
  const uploadFile = fileState
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
    fileState = null;
  }
});

// 読み込み時の初期化イベント処理
document.addEventListener("DOMContentLoaded", init);