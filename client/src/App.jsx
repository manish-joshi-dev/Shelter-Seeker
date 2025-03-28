import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import SignIn from "./pages/signin.jsx";
import SignUp from "./pages/signup.jsx";
import CreateListing from "./pages/createListing.jsx";
import Updatelisting from "./pages/updatelisting.jsx";
import PrivateRoute from "./components/privateRoute.jsx";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>

          <Route element={<PrivateRoute />}>
            <Route path="/listing" element={<CreateListing />}></Route>
            <Route
              path="/updatelisting/:id"
              element={<Updatelisting />}
            ></Route>
          </Route>

          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
