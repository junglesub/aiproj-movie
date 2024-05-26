import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { firestore } from "../tools/firebase";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Submit({ selectedMovies }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const navigate = useNavigate();

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    signInAnonymously(auth);
  }, []);

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
  return (
    <div>
      <h1>Almost Done!!</h1>
      <div className="center mcenter">
        {!user ? (
          <h3>Please Wait</h3>
        ) : (
          <button
            disabled={submitLoading}
            onClick={async () => {
              setSubmitLoading(true);

              try {
                // Add to DB
                await addDoc(collection(firestore, "result"), {
                  ...selectedMovies,
                  uid: user.uid,
                  createdAt: serverTimestamp(),
                });

                // Then Aggregate
                const aggUpdateDoc = Object.values(
                  selectedMovies.options
                ).reduce((prev, curr) => {
                  prev[curr.movieId] = increment(1);
                  return prev;
                }, {});
                await updateDoc(doc(firestore, "agg/counter"), {
                  ...aggUpdateDoc,
                });
                navigate("/stats");
              } catch (e) {
                alert(e);
              }
            }}
          >
            Submit (등록하기)
          </button>
        )}
      </div>
    </div>
  );
}

export default Submit;
