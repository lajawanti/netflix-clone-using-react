import React, { useState, useEffect } from "react";
import axios from "./../../Data/axios.js";
import requests from "../../Data/requests.js";
import MyWatchList from './../myWatchList/MyWatchList.js';
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import Swal from '@sweetalert/with-react';

import "./Banner.css";

const baseURL = "https://image.tmdb.org/t/p/original/";

const Banner = ({user}) => {
  const [movie, setMovie] = useState([]);
  const [showMyList, setShowMyList] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  
  //to show random movie poster and info in banner...
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      console.log(request.data.results);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  // if the decription of movie is too long to limit it to 500 characters using truncate function.
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const showList = () => {
    setShowMyList(true)
  }

  const opts = {
    height: "500",
    width: "80%",
    playerVars: {
        autoplay: 1,
    },
};

const handleTrailerdisplay = () => {
   if (trailerUrl) {
       setTrailerUrl("");
    } else {
        movieTrailer(movie?.name || "")
          .then((url) => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          })
          .catch((error) => {  
                console.log(error)
                Swal(
                      <div>
                            <h1>OOPS..</h1>
                            <p style= {{paddingTop:'10px'}}>No movie trailer found</p>
                      </div>
                )
          });
    }
};

  return (
    <>
    <header
      className="banner"
      style={{
        backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
        backgroundImage: `url(${baseURL}${movie?.backdrop_path})`,
        // backgroundPosition: "center center",

            backgroundSize: '100vw 65vh',
            backgroundAttachment: 'fixed',
            // height: '40em',
            marginTop: '0',
            padding: '0'
      }}
    >
      <div className="banner__contents">
        {/* title */}
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        {/* Buttons play.. */}
        <div className="banner__buttons">
          <button className="banner__button" onClick= {() => {handleTrailerdisplay()}}>Play trailer</button>
          <button className="banner__button" onClick = {() => showList()}>My List</button>
        </div>
        {/* description */}
        <h5 className="banner__description">
          {" "}
          {truncate(movie?.overview, 300)}
        </h5>
      </div>
      {/* ********************************************************************************************** */}
{/* 
      <div className="banner__movie__image"
           style={{
              
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundImage: `url(${baseURL}${movie?.backdrop_path})`,
              backgroundPosition: "center center",objectFit: 'contain', height: '500px', marginBottom: '20px', flex :'0.67 1'
            }}
      >
      </div> */}
      {trailerUrl ? (
                              <div className="movie-trailer-window">
                                    {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

                                    <button className="close__button" onClick={() => setTrailerUrl("")}>
                                          Close
                                    </button>
                              </div>
                        ) : null }
      <div className="banner--fadeBottom" />
    </header>
    {/* <div className="banner--fadeBottom" /> */}
    { showMyList ? (<MyWatchList user = {user} setShowMyList ={setShowMyList}/>) : null }

    </>
  );
};

export default Banner;
