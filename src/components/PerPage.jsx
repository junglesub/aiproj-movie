import React, { useEffect, useState } from "react";

import "./PerPage.css";
import MovieCard from "./MovieCard";
import { categories, dummyCatData } from "../tools/categories";
import { child, get, ref } from "firebase/database";
import { database } from "../tools/firebase";
import { findDuplicates, shuffleArray } from "../tools/funcs";

function PerPage({ setSelectedMovies, selectedMovies }) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  useEffect(() => {
    setLoading(true);
    setOptions({});
  }, [selectedMovies]);
  useEffect(() => {
    console.log(selectedMovies);
    (async () => {
      const movieData = (
        await get(child(ref(database, "movies"), `${selectedMovies.last}`))
      ).val();

      const model1_2 = (
        await get(child(ref(database, "model1-2"), `${selectedMovies.last}`))
      ).val();

      const model1 = model1_2.model1.map((id) => ({ movieId: id, model: 1 }));
      const model2 = model1_2.model2.map((id) => ({ movieId: id, model: 2 }));

      const model3 = (
        await get(child(ref(database, "model3"), `${movieData.movieId_3}`))
      ).val();
      const model3_r = model3.movieId
        .map((movieId, index) => ({
          movieId,
          org: model3.org[index],
        }))
        .map((item) => ({ ...item, model: 3 }));
      const model4 = categories[movieData.first_genre].map((id) => ({
        movieId: id,
        model: 4,
      }));
      console.log({ movieData, model1, model2, model3_r, model3, model4 });

      // 알고리즘 가동.
      let model1_i,
        model2_i,
        model3_i,
        model4_i,
        i = 0;
      while (true) {
        const attempt = [
          model1[i].movieId,
          model2[i].movieId,
          model3_r[i].movieId,
          model4[i].movieId,
        ];
        const duplicate = findDuplicates([
          ...attempt,
          ...selectedMovies.banned,
          model1_i?.movieId,
          model2_i?.movieId,
          model3_i?.movieId,
          model4_i?.movieId,
        ]);
        console.log({
          ll: [
            ...attempt,
            ...selectedMovies.banned,
            model1_i,
            model2_i,
            model3_i,
            model4_i,
          ],
          duplicate,
        });

        // 중복 됐는지 확인
        if (!model1_i) {
          if (i >= model1.length) model1_i = model1[model1.length - 1];
          if (!duplicate.includes(model1[i].movieId))
            model1_i = { ...model1[i], i };
        }
        if (!model2_i) {
          if (i >= model2.length) model2_i = model2[model2.length - 1];
          if (!duplicate.includes(model2[i].movieId))
            model2_i = { ...model2[i], i };
        }
        if (!model3_i) {
          if (i >= model3_r.length) model3_i = model3_r[model3_r.length - 1];
          if (!duplicate.includes(model3_r[i].movieId))
            model3_i = { ...model3_r[i], i };
        }
        if (!model4_i) {
          if (i >= model4.length) model4_i = model4[model4.length - 1];
          if (!duplicate.includes(model4[i].movieId))
            model4_i = { ...model4[i], i };
        }

        console.log(i, { model1_i, model2_i, model3_i, model4_i });
        if (model1_i && model2_i && model3_i && model4_i) break;
        i++;
      }

      setOptions(shuffleArray([model1_i, model2_i, model3_i, model4_i]));
      setLoading(false);
    })();
  }, [selectedMovies]);
  if (loading) return <div>Loading...</div>;

  const nextQ = (movie) => {
    console.log("A", movie);
    setSelectedMovies((prev) => ({
      ...prev,
      step: prev.step + 1,
      banned: [...prev.banned, ...options.map((item) => item.movieId)],
      last: movie.movieId,
      options: { ...prev.options, [prev.step]: movie },
    }));
  };

  return (
    <div className="PerPage">
      <div className="grid-container">
        <MovieCard
          className="grid-item"
          movieId={options[0].movieId}
          onClick={() => nextQ(options[0])}
        />
        <MovieCard
          className="grid-item"
          movieId={options[1].movieId}
          onClick={() => nextQ(options[1])}
        />
        <MovieCard
          className="grid-item"
          movieId={options[2].movieId}
          onClick={() => nextQ(options[2])}
        />
        <MovieCard
          className="grid-item"
          movieId={options[3].movieId}
          onClick={() => nextQ(options[3])}
        />
      </div>
    </div>
  );
}

export default PerPage;
