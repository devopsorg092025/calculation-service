import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Calculator from "./components/Calculator";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div>
      <h1>Calculator App</h1>
      {!token ? (
        <>
          <Login setToken={setToken} />
          <Register />
        </>
      ) : (
        <Calculator token={token} />
      )}
    </div>
  );
}

export default App;

