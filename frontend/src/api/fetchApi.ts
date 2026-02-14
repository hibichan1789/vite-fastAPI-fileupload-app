// src/api/fetchAPI.ts
import type { FileResponse } from "../interfaces/file";
const baseApiUrl = import.meta.env.VITE_API_URL;
const getALLUrl = `${baseApiUrl}/file/all`
export async function fetchFileAll():Promise<FileResponse[]>{
    const response = await fetch(getALLUrl);
    if(!response.ok){
        throw new Error("データの取得に失敗しました");
    }
    const FileResponses:FileResponse[] = await response.json()
    return FileResponses;
}

const postFileUrl = `${baseApiUrl}/file/upload`;
export async function postFileAsync(file:File){
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(postFileUrl,{
        method:"POST",
        body:formData
    });
    if(!response.ok){
        throw new Error("アップロードに失敗しました");
    }
    return await response.json();
}