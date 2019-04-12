import { post } from 'axios';

export function upload(files) {
    
    let formdata = new FormData();
    formdata.append('file', new Blob(files));
    
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    
    const res = post('http://localhost:5000/api/v1/files/upload', formdata, config);   

    return res;
}