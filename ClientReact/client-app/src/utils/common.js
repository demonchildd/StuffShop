import axios from "axios";
import { url } from "./constants";


export const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());


export const buildUrl = (url, params) => {
    let urlWithParams = url;

    Object.entries(params).forEach(([key, value], i) => {
        const sign = !i ? '?' : '&';
        urlWithParams += `${sign}${key}=${value}`
    })
    return urlWithParams;
}

export const sumBy = (arr) => arr.reduce((prev, cur) => prev + cur, 0);


export const AddItems = async (data) => {
    try{

    
        if( JSON.parse(localStorage.getItem('user'))) {
            
            const token = localStorage.getItem('access_token');
            const res = await axios.post(url + '/basket/addItems', {items: data, id: JSON.parse(localStorage.getItem('user')).id}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
    }
    catch(err) {
        console.log(err);
    }
    
}






