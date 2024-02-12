import { TOKEN_KEY } from "./context/AuthProvider";
import { useEffect, useState } from "react";
import axios from "axios";


export const Landing = () => {
  const [users, setUsers] = useState([])

  const queryParameters = new URLSearchParams(window.location.search);
  const google_token = queryParameters.get("token");
  
  if (google_token) localStorage.setItem(TOKEN_KEY, google_token);
   

  const getUsers = async () => {
    const { data } = await axios.get('https://localhost:8000/users')
    console.log(data.users_list)
    setUsers(data.users_list)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div>
      <h2>Landing (Protected)</h2>
      <h3>Contacts List:</h3>
      <div>
        {users.map((value) => (
          <div key={value._id}>{value.name}</div>
        ))}
      </div>
     
    </div>
  );
};