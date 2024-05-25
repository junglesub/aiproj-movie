import React from "react";

import "./MovieCard.css";

function MovieCard({ movieId, className = "", data, onClick }) {
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
      <div class="poster">
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
