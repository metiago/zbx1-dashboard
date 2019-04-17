import { get } from 'axios';


export function findAll() {

    const res = get('http://localhost:5000/api/v1/files/metiago');

    return res;
}