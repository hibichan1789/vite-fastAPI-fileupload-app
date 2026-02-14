// src/interface/file.ts
export interface FileResponse{
    id:number;
    original_name:string;
    stored_name:string;
    file_size:number;
    content_type:string;
    extension:string;
    uploaded_at:string;
}