import { useState } from "react";
import { useAuth } from "./context/AuthProvider";
import axios from "axios"

export const Home = () => {
  const { value } = useAuth();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")

  const handleUserChange = (event) => {
        setUser(event.target.value)
  }

  const handlePasswordChange = (event) => {
        setPassword(event.target.value)
  }

  const login = async () => {
    const success = await value.onLogin(user, password)
    if(success) {
        setError("")
    } else {
        setError("Incorrect username or password")
    }
  }

  const handleOath = async (e) => {
    console.log("OATH")
    e.preventDefault();
    const data = {user, password}
    try {
      const response = await axios.post(
        "https://localhost:8000/request",
        data
      )
      if (response.status === 200) {
        console.log(response)
        window.location.href = response.data.url;
      } else {
        setUser("OATH FAILED");
      }
    } catch (error) {
      setUser("OATH");
    }
  };

  return (
    <>
      <h2>Home (Public)</h2>
      <form onSubmit={login}>
        <label>
          Username
            <input type="text" name="username" onChange={handleUserChange}></input>
        </label>
        <label>
            Password
            <input type="text" name="password" onChange={handlePasswordChange}></input>
        </label>
        <button type="button" onClick={login}>
          Sign In
        </button>

        <button type="button" onClick={handleOath}>
          Login with Google
        </button>
      </form>
      <p>{error}</p>
    </>
  );
  };