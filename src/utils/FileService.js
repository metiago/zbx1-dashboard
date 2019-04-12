import { get, post } from 'axios';
import { getIdToken } from './AuthService'



export function upload(files) {

    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': getIdToken()
        }
    }
    
    // TODO: Iterate files to upload multiple them
    let formdata = new FormData();
    formdata.append('file', files[0]);
    
    const res = post('http://localhost:5000/api/v1/files/upload', formdata, config);   

    return res;
}

export function findAll() {

    const config = {
        headers: {
            'content-type': 'application/json',
            'Authorization': getIdToken()
        }
    }

    const res = get('http://localhost:5000/api/v1/files/metiago', config); 

    return res;
}