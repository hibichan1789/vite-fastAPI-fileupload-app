// src/utils/fileUtils.ts

export function reshapeBite(bite:number):string{
    if(bite < 1024*1024){
        const kb = (bite/1024).toFixed(2)//toFixed()指定した桁に四捨五入してくれる
        return `${kb} KB`;
    }
    const mb = (bite/(1024*1024)).toFixed(2);
    return `${mb} MB`;
}
export function reshapeDate(uploadedAt:string):string{
    const date = new Date(uploadedAt).toLocaleString();
    return date;
}

export function validateInputFiles(files:FileList|null):boolean{
    if(!files||files.length === 0){
        return false;
    }
    return true;
}
export function validateFile(file:File, maxMb:number):boolean{
    if(!validateFileSize(file.size, maxMb)){
        return false;
    }
    if(!validateName(file.name)){
        return false;
    }
    return true;
}
function validateFileSize(fileSize:number, maxMb:number):boolean{
    return fileSize <= maxMb*1024*1024;
}
function validateName(fileName:string|null):boolean{
    if(!fileName){
        return false;
    }
    if(fileName.trim() === ""){
        return false;
    }
    return true;
}

export function getDownloadId(buttonId:string):string{
    const id = buttonId.split("-").at(-1) as string;
    return id;
}