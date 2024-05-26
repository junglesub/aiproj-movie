import React, { useEffect, useState } from "react";

import "./MovieCard.css";
import { child, get, ref } from "firebase/database";
import { database } from "../tools/firebase";

function MovieCard({
  movieId,
  className = "",
  data: orgdata,
  onClick,
  autoGetData = true,
}) {
  const [data, setData] = useState(orgdata);
  useEffect(() => setData((prev) => ({ ...prev, ...orgdata })), [orgdata]);

  useEffect(() => {
    if (!!data || !autoGetData) return;
    console.log("Auto Data");
    const dbRef = ref(database, "movies-ko");
    (async () => {
      const snapshot = await get(child(dbRef, `${movieId}`));
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    })();
  }, [data]);
  if (!data) {
    return (
      <div
        className={("MovieCard " + className).trim()}
        style={onClick && { cursor: "pointer" }}
        onClick={onClick}
      >
        MovieCard {movieId}
      </div>
    );
  }
  const { title, poster_path, original_title } = data;
  return (
    <div
      className={("MovieCard " + className).trim()}
      style={onClick && { cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="poster">
        <img
          src={"https://image.tmdb.org/t/p/w500/" + poster_path}
          alt={title + " Poster"}
        />
      </div>
      <div className="name">{original_title}</div>
    </div>
  );
}

export default MovieCard;
