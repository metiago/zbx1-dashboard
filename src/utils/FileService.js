import { get, post } from 'axios';
import { getIdToken } from './AuthService'



export function upload(files) {

    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': getIdToken()
        }
    }

    let formdata = new FormData();
    for (let file of files) {
        formdata.append('file', file);
    }

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