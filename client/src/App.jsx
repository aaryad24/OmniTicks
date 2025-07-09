import React from "react";
import Navbar from "./components/Navbar.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Footer from "./components/Footer";
import Layout from "./pages/admin/Layout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx"
import AddShows from "./pages/admin/AddShows.jsx"
import ListShows from "./pages/admin/ListShows.jsx"
import ListBookings from "./pages/admin/ListBookings.jsx"
import { useAppContext } from "./context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";
import Loading from "./components/Loading.jsx";
import IntroVideo from "./components/IntroVideo.jsx";
import UpcomingMovies from "./pages/UpcomingMovies.jsx";
import TheatersPage from "./pages/Theaters.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = useLocation().pathname.startsWith("/admin")
  const isHomePage = location.pathname === "/";

  const { user } = useAppContext()

  return (
    <>
    <IntroVideo>

      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/theaters" element={<TheatersPage />} />
        <Route path="/releases" element={<UpcomingMovies />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/admin/*" element={user ? <Layout/> : (
          <div className="'min-h-screen flex justify-center items-center">
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && isHomePage && <Footer />}
    </IntroVideo>
    </>
  );
};

export default App;
