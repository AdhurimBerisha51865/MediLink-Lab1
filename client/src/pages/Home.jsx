import React from "react";
import Header from "../components/Header";
import SpecialtyMenu from "../components/SpecialtyMenu";
import TopDoctors from "../components/TopDoctors";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialtyMenu />
      <TopDoctors />
    </div>
  );
};

export default Home;
