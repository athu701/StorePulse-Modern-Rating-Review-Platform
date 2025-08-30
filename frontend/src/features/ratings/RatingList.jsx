import React from "react";

export default function RatingList({ ratings }) {
  return (
    <ul className="list-group">
      {ratings.map((r) => (
        <li key={r.id} className="list-group-item">
          <b>{r.userName}</b>: {r.comment} ({r.rating_value}/5)
        </li>
      ))}
    </ul>
  );
}
