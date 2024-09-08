import Features from "./container/Features";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChallengeList from "./container/ChallengeList";
import { Routes, Route } from "react-router-dom";
import Challenge from "./pages/Challenge";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="challenge/:id" element={<Challenge />} />
        <Route
          path="/"
          element={
            <>
              <ChallengeList />
              <Features />
            </>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;