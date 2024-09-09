import { ENDPOINT_URL } from "../constants/constants";


export const createRg =(rg)=>{
    return fetch(`${ENDPOINT_URL}/createRg`,{
        method: 'POST',
        headers:{
            Accept:'application/json',
            'Content-type' : 'application/json'
        },
        body :JSON.stringify(rg)
    }).then((res) =>{
        return res.json()
    }).catch(err=>{
        console.log(err)
    })
}

export const getALLRg=()=>{
    return fetch(`${ENDPOINT_URL}/getALLRg`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            'Content-type' : 'application/json'
        },
    }).then((res) =>{
        return res.json()
    }).catch(err=>{
        console.log(err)
    })
}


export const UpdateRg=(id,body)=>{
    return fetch(`${ENDPOINT_URL}/updateRgById/${id}`,{
        method:'PATCH',
        headers:{
            Accept:'application/json',
            'Content-type' : 'application/json'
        },
        body :JSON.stringify(body)
    }).then((res) =>{
        return res.json()
    }).catch(err=>{
        console.log(err)
        
    })
}

export const deleteRg = (id) =>{
    return fetch(`${ENDPOINT_URL}/deleteRgById/${id}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            'Content-type' : 'application/json'
        },
    }).then((res) =>{
        return res.json()
    }).catch(err=>{
        console.log(err)
        
    })
}