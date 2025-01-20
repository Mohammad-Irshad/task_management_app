import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../app/features/userSlice'
import { Link, useNavigate } from 'react-router-dom'

const UserLogin = () => {
    const [email, setEmail] = useState("guestuser@gmail.com")
    const [password, setPassword] = useState("121001@Gu")
    const [errorMessage, setErrorMessage] = useState(null)
    
    const token = localStorage.getItem('accessToken')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    

    useEffect(() => {
        if (token) {
            navigate('/dashboard')
        }
    }, [token, navigate])

    const loginHandler = async (e) => {
        e.preventDefault()
        const userDetails = {email, password}
        try{
            const result = await dispatch(loginUser(userDetails)).unwrap()
            setErrorMessage(null)
            navigate('/dashboard')
        }catch(err){
            setErrorMessage(`Login failed : ${err.message || "Something went wrong"}`)
        }
    }



  return (
    <main className='p-5 m-5 d-flex justify-content-center'>
        <div className='container m-5 p-5' style={{maxWidth : '500px', margin : 'auto'}}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title text-center">To-Do Login </h5>
                    <form onSubmit={loginHandler}>
                        <label className="form-lable" htmlFor='userEmail'>Email: </label><br/>
                        <input className='form-control' id='userEmail' type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} /><br/>
                        <label className="form-lable" htmlFor='userPassword'>Password: </label><br/>
                        <input className='form-control' id='userPassword' type='text' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}/><br/>
                        <button type='submit' className='btn btn-primary'>Login</button>                        
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>   
                    <br/>
                    <Link to={'/signup'}>Don't have an account? Click here to singup.</Link> 
                    <p>Click Login! To Login as Guest User.</p>
                </div>
            </div>
        </div>
    </main>    
  )
}

export default UserLogin
