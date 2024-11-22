import React from "react";

export default function Input({ title, value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div style={{ fontFamily: "Arial", margin: 4 }}>
      <label> {title} </label>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
}
