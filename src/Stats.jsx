import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database, firestore } from "./tools/firebase";
import { child, get, ref } from "firebase/database";

import "./Stats.css";

const doRank = (data) => {
  // Convert the object to an array of [key, value] pairs
  const entries = Object.entries(data);

  // Sort the entries by value in descending order
  entries.sort((a, b) => b[1] - a[1]);

  // Extract the top three entries
  const topThree = entries.slice(0, 3);

  // Convert the top three entries back to an object
  const rankedResults = [
    topThree[0] ? { [topThree[0][0]]: topThree[0][1] } : null,
    topThree[1] ? { [topThree[1][0]]: topThree[1][1] } : null,
    topThree[2] ? { [topThree[2][0]]: topThree[2][1] } : null,
  ];
  return rankedResults;
};

const StatItem = ({ doc, rank }) => {
  console.log(doc);
  return (
    <div className="stat-container">
      <img src={"https://image.tmdb.org/t/p/w500/" + doc.backdrop_path} />
      <div className="centered-text">
        <div className="rank">
          {rank}등<span className="cnt">{doc.handong_count}표</span>
        </div>
        <div className="title">
          <b>{doc.title}</b>
        </div>
        <div className="desc">{doc.overview.slice(0, 100)}</div>
      </div>
    </div>
  );
};

function Stats() {
  const [rank, setRank] = useState();
  useEffect(() => {
    (async () => {
      const counterDocRef = doc(firestore, "agg", "counter");
      const counterDocSnap = await getDoc(counterDocRef);

      if (counterDocSnap.exists()) {
        const data = doRank(counterDocSnap.data());
        console.log(data);

        const dbRef = ref(database, "movies-ko");
        const datainfo = data.map(async (item) => {
          const movieId = Object.keys(item)[0];
          const snapshot = await get(child(dbRef, `${movieId}`));
          if (snapshot.exists()) {
            return { ...snapshot.val(), handong_count: item[movieId] };
          }
        });
        setRank(await Promise.all(datainfo));
      } else {
        console.log("No such document!");
      }
    })();
  }, []);
  console.log(rank);
  if (!rank) return <div>Loading...</div>;
  return (
    <div className="Stats center">
      <h1>한동대에서 인기 있는 영화는?</h1>
      <StatItem doc={rank[0]} rank={1} />
      <StatItem doc={rank[1]} rank={2} />
      <StatItem doc={rank[2]} rank={3} />
    </div>
  );
}

export default Stats;
