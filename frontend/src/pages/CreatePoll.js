import { useState } from "react";
import api from "../services/api";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  const addOption = () => setOptions([...options, ""]);

  const submitPoll = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "/polls",
      {
        question,
        options: options.map(o => ({ text: o })),
        allowMultiple,
        expiresAt
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    alert("Poll Created Successfully!");
  };

  return (
    <div className="card">
      <h2>Create New Poll</h2>

      <input
        placeholder="Enter your question"
        onChange={e => setQuestion(e.target.value)}
      />

      <div className="options">
        {options.map((o, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            onChange={e => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
          />
        ))}
      </div>

      <button onClick={addOption}>+ Add Option</button>

      <div className="checkbox">
        <input
          type="checkbox"
          checked={allowMultiple}
          onChange={() => setAllowMultiple(!allowMultiple)}
        />
        <label>Allow multiple answers</label>
      </div>

      <label>Expiration Date & Time</label>
      <input
        type="datetime-local"
        onChange={e => setExpiresAt(e.target.value)}
      />

      <button onClick={submitPoll}>Create Poll</button>
    </div>
  );
}
