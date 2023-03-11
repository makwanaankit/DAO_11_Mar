import React from "react";
import Banner from "../components/Banner";
import CreateProposal from "../components/CreateProposal";
import Proposal from "../components/Proposal";
const Home = () => {
  return (
    <div>
      <Banner />
      <Proposal />
      <CreateProposal />
    </div>
  );
};

export default Home;
