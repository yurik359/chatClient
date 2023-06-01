import LeftSide from "../../components/LeftSide/LeftSide";
import RightSide from "../../components/rightSide/RightSide";

import "./home.css";
const Home = () => {
  return (
    <>
      <div className="home-container">
        <LeftSide />
        <RightSide />
      </div>
    </>
  );
};

export default Home;
