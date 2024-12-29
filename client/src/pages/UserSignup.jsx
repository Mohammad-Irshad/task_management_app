import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signUpUser } from '../app/features/userSlice'
import { Link } from 'react-router-dom'

const UserSignup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const dispatch = useDispatch()

    const signupHandler = async (e) => {
        e.preventDefault()
        const userDetails = {name, email, password}
        try {
            const result = await dispatch(signUpUser(userDetails)).unwrap()
            setErrorMessage(null)
            setSuccessMessage(result.message)
        }catch(error){
            console.error("Signup Failed: ", error.message)
            setSuccessMessage(null)
            setErrorMessage(error.message || error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <main className='p-5 m-5 d-flex justify-content-center'>
            <div className='container m-5' style={{maxWidth : '500px', margin : 'auto'}}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title text-center">To-Do Signup </h5>
                        <form onSubmit={signupHandler}>
                            <label className="form-lable" htmlFor='userName'>Name: </label><br/>
                            <input className='form-control' id='userName' type='text' placeholder='Enter Name' onChange={(e) => setName(e.target.value)} /><br/>
                            <label className="form-lable" htmlFor='userEmail'>Email: </label><br/>
                            <input className='form-control' id='userEmail' type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} /><br/>
                            <label className="form-lable" htmlFor='userPassword'>Password: </label><br/>
                            <input className='form-control' id='userPassword' type='text' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}/><br/>
                            <button type='submit' className='btn btn-success'>Signup</button>
                            {successMessage && <p className='text-success'>{successMessage}.</p>}
                            {errorMessage && <p className='text-danger'>{errorMessage}.</p>}
                        </form><br/>      
                        <Link to={'/'}>Already have an account? Click here to login.</Link>     
                    </div>
                </div>
            </div>
        </main>
      
    )
}

export default UserSignup
