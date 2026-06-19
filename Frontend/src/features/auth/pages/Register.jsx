import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.css"
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ name, setName ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const {loading,handleRegister} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ name, username, email, password })
            navigate("/dashboard")
        } catch (err) {
            setError(err?.response?.data?.message || "Unable to create account. Please try again.")
        }
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Create account</h1>
                <p className="form-subtitle">Get tailored questions and a prep roadmap in minutes.</p>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            onChange={(e) => { setName(e.target.value) }}
                            type="text" id="name" name='name' placeholder='Enter your name' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    {error && <p className='auth-error'>{error}</p>}

                    <button className='button primary-button' >Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
            </div>
        </main>
    )
}

export default Register