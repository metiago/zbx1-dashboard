import { get } from 'axios';
import { getIdToken } from './AuthService'

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