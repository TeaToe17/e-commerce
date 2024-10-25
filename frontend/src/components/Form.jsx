import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import LoadingIndicator from "./LoadingIndicator"

function Form({route, method}) {
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method == "login" ? "Login" : "Register"   

    const HandleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await api.post(route, {username, password})
            if (method == "login")  {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return(
        <form onSubmit={HandleSubmit} >
            <h1> {name} </h1>
            <input
                className=""
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className=""
                type="text"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            { loading && <LoadingIndicator/> }
            <button type="submit" >
                {name}
            </button>
        </form>
    )
}

export default Form