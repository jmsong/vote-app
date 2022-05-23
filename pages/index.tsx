// index.tsx
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import firebaseApp, { firestoreDb } from "../firebase/clientApp";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { VoteDocument } from "../types";
import Auth from "../components/Auth";

export default function Home() {
  // Destructure user, loading, and error out of the hook.
  const [user, loading, error] = useAuthState(getAuth(firebaseApp));
  const [votes, votesLoading, votesError] = useCollection(collection(firestoreDb, "votes"), {});

  if (!votesLoading && votes) {
    votes.docs.map((doc) => console.log(doc.data()));
  }

  const addVoteDocument = async (vote: string) => {
    try {
      const docRef = await addDoc(collection(firestoreDb, "votes"), { vote });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // index.tsx
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gridGap: 8,
        background: "linear-gradient(180deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
      }}
    >
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user && (
        <>
          <h1>President vote</h1>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <button style={{ fontSize: 32, marginRight: 8 }} onClick={() => addVoteDocument("yes")}>
              Donald Trump Goes
            </button>
            <h3>Donald Trump Lovers: {votes?.docs?.filter((doc) => (doc.data() as VoteDocument).vote === "yes").length}</h3>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <button style={{ fontSize: 32, marginRight: 8 }} onClick={() => addVoteDocument("no")}>
            Donald Trump No-Goes
            </button>
            <h3>Donald Trump Haters: {votes?.docs?.filter((doc) => (doc.data() as VoteDocument).vote === "no").length}</h3>
          </div>
        </>
      )}
    </div>
  );
}
