import { useState } from "react";
import axios from "axios";

export default function Calculator({ token }) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [result, setResult] = useState(null);

  const callAPI = async (operation) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CALC_URL}/calc/${operation}`,
        { a: Number(a), b: Number(b) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.result);
    } catch {
      alert("Operation failed");
    }
  };

  return (
    <div>
      <h2>Calculator</h2>
      <input type="number" value={a} onChange={e => setA(e.target.value)} />
      <input type="number" value={b} onChange={e => setB(e.target.value)} />
      <div>
        <button onClick={() => callAPI("add")}>Add</button>
        <button onClick={() => callAPI("subtract")}>Subtract</button>
        <button onClick={() => callAPI("multiply")}>Multiply</button>
        <button onClick={() => callAPI("divide")}>Divide</button>
      </div>
      {result !== null && <h3>Result: {result}</h3>}
    </div>
  );
}
