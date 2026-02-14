import { fetchFileAll } from "./api/fetchApi";

const files = await fetchFileAll();
console.log(files)