import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useEffect } from 'react';

function Home() {


  useEffect(() => {
    axios.get('http://localhost:8080/api/createTables').then('created').catch(error => {
      console.error(error);
    });

    axios.get('http://localhost:8080/api/alterTables').then(console.log('tables altered')).catch(error => {
      console.error(error);
    });

  },[])

  

  const navigate = useNavigate()
  const [username,setusername] = useState('')

  const ChangeHandler = (e)=>{
    setusername(e.target.value)
  }

  const showError = ()=>{
    alert('enter corect details')
  }

 return (
    <div>
      <p>username</p>
      <input type="text" value={username} onChange={(e)=>{ChangeHandler(e)}} placeholder='username' />
      <br />
      <input type="password" placeholder='password'/>
      <br />
      {username?
      <button onClick={() => {
              navigate("/pets", {
                state: {
                  username: username,
                },
              });
            }}
          >Login</button>:<button onClick={()=>showError()} >login</button>}
    </div>
  )
}

export default Home