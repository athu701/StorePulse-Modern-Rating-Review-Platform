import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import StoreCard from "./StoreCard";
import { getStores } from "./StoresSlice";

export default function StoresList({ onReviewClick }) {
  const { list } = useSelector((state) => state.stores);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStores());
  }, [dispatch]);

  const filtered = list.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container my-4">
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search stores..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="row">
        {filtered.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onReviewClick={onReviewClick}
          />
        ))}
      </div>
    </div>
  );
}
