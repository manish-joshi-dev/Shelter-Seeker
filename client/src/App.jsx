import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import SignIn from "./pages/signin.jsx";
import SignUp from "./pages/signup.jsx";
import CreateListing from "./pages/createListing.jsx";

import PrivateRoute from "./components/privateRoute.jsx";
import Lds from "./pages/listing.jsx";
import Search from "./pages/search.jsx";
import Profile from "./pages/profile.jsx";
import UpdateListing from "./pages/updateListing.jsx";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/listing/:id" element={<Lds />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/listing" element={<CreateListing />}></Route>

            <Route
              path="/updatelisting/:id"
              element={<UpdateListing />}
            ></Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/mychats" element={<MyChats />}></Route>
          </Route>

          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
