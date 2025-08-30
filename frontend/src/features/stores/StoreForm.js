import React, { useState } from "react";

export default function StoreForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", address: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="p-3" onSubmit={handleSubmit}>
      {Object.keys(form).map((key) => (
        <div className="mb-3" key={key}>
          <label>{key}</label>
          <input
            className="form-control"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
