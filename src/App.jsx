import { useEffect, useState } from "react";
import "./App.css";
import { auth, database, provider } from "./tools/firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { dummyCatData, categories as org_cat } from "./tools/categories";
import MovieCard from "./components/MovieCard";
import { getFirstNElements, getUniqueElements } from "./tools/funcs";
import { child, get, ref } from "firebase/database";
import PerPage from "./components/PerPage";

function App() {
  const [mainMovies, setMainMovies] = useState({});
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const selectedMovieInitStats = {
    step: 0,
    banned: [],
    last: null,
    first: null,
    options: {},
  };
  const [selectedMovies, setSelectedMovies] = useState(selectedMovieInitStats);

  const categories = getFirstNElements(org_cat, 2);

  console.log(selectedMovies);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const movieIds = getUniqueElements(categories);
    console.log(movieIds);

    setMainMovies(dummyCatData);
    return;

    const dbRef = ref(database, "movies-ko");

    (async () => {
      movieIds.map((path) => console.log(path));
      const fetchPromises = movieIds.map((path) =>
        get(child(dbRef, `${path}`))
      );
      const snapshots = await Promise.all(fetchPromises);
      snapshots.map((snapshot) => {
        if (snapshot.exists()) {
          setMainMovies((prev) => ({
            ...prev,
            [snapshot.key]: snapshot.val(),
          }));
        }
      });
    })();
  }, []);

  const LoginPlease = () => {
    return (
      <div className="center">
        <h1>Login Please</h1>
        <button
          onClick={() => {
            signInWithPopup(auth, provider)
              .then((result) => {
                console.log(result.user);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          Login using google
        </button>
      </div>
    );
  };

  if (!user) {
    return <LoginPlease />;
  }

  if (selectedMovies.step > 0) {
    return (
      <PerPage
        selectedMovies={selectedMovies}
        setSelectedMovies={setSelectedMovies}
      />
    );
  }

  console.log(mainMovies);

  return (
    <div className="App">
      <button className="" onClick={() => signOut(auth)}>
        Sign out
      </button>
      <h1>Handong Movie Selector</h1>
      <p>여러분이 최근 재밌게 본 영화를 선택해보세요</p>
      <p>Choose a movie you've enjoyed watching recently.</p>
      {Object.keys(categories).map((catname) => (
        <div key={catname}>
          <h2>{catname}</h2>
          <div className="options">
            {categories[catname].map((movieId) => (
              <MovieCard
                key={catname + "-" + movieId}
                className=""
                movieId={movieId}
                data={mainMovies[movieId]}
                autoGetData={false}
                onClick={() => {
                  setSelectedMovies((prev) => ({
                    ...prev,
                    step: 1,
                    last: movieId,
                    first: movieId,
                    banned: [movieId],
                  }));
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
