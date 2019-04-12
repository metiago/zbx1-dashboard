import { post } from 'axios';
import { getIdToken } from './AuthService'

export function upload(files) {
    
    // TODO: Iterate files to upload multiple them
    let formdata = new FormData();
    formdata.append('file', files[0]);
    
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': getIdToken()
        }
    }
    
    const res = post('http://localhost:5000/api/v1/files/upload', formdata, config);   

    return res;
}