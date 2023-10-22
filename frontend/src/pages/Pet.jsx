import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

function Pet() {

    const [searchedValue, setsearchedValue] = useState('')

    const Search = (e) => {
        setsearchedValue(e.target.value)
    }
    const location = useLocation();
    const username = location?.state?.username
    const [names,setnames] = useState([])
    const [roleId, setRoleId] = useState()
    useEffect(()=>{
        axios.get('http://localhost:8080/api/getAdopters').then(e=>setnames(e.data)).catch(e=>console.log(e));
    },[])

    console.log(names)

    useEffect(()=>{
        const filteredNames = names.filter(e => e.name === username);
        const roleId = filteredNames.map(e => e.role_id);
        setRoleId(roleId[0])
    },[names])

    const updateUserRole = () => {
        const name = username; 
        const roleID = roleId; 
        const apiUrl = `http://localhost:8080/api/setRoles/${name}/${roleID}`;
        const password = 'root'

        axios.put(apiUrl,{ password })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Welcome, {username}</h1>
            {roleId !== null && (
                <p>Your role ID is: {roleId}</p>
            )}
            <button onClick={updateUserRole}>Update User Role</button>
        </div>
    )
}

export default Pet