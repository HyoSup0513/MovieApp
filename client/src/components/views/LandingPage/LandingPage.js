import React, { useEffect, useState, useRef } from "react";
import { Typography, Row, Button } from "antd";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  IMAGE_SIZE,
  POSTER_SIZE,
} from "../../Config";
import MainImage from "./Sections/MainImage";
import GridCards from "../Commons/GridCards";
import MovieByLatest from "./MovieByLatest";
import MovieByNowPlaying from "./MovieByNowPlaying";
import MovieByPopular from "./MovieByPopular";

const { Title } = Typography;

function LandingPage() {
  const [stateOne, setstateOne] = useState(false);
  const [stateTwo, setstateTwo] = useState(true);
  const [stateThree, setstateThree] = useState(true);

  const [view, setview] = useState("popular");
  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);
  const [CurrentPage, setCurrentPage] = useState(0);
  const endpoint = `${API_URL}movie/${view}?api_key=${API_KEY}&language=en-US&page=1`;
  // Main Page's image
  useEffect(() => {
    fetchMovies(endpoint);
  }, []);

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        // Just add state
        setMovies([...Movies, ...result.results]);
        setMainMovieImage(result.results[0]);
        setCurrentPage(result.page);
      });
  };

  // change view state on button click
  const viewLatest = () => {
    setstateOne(false);
    setstateTwo(true);
    setstateThree(true);
  };

  const viewPlaying = () => {
    setstateOne(true);
    setstateTwo(false);
    setstateThree(true);
  };

  const viewPopular = () => {
    setstateOne(true);
    setstateTwo(true);
    setstateThree(false);
  };

  // Load More Button
  const loadMoreItems = () => {
    const endpoint = `${API_URL}movie/${view}?api_key=${API_KEY}&language=en-US&page=${
      CurrentPage + 1
    }`;
    fetchMovies(endpoint);
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {/* Main Image */}
      {MainMovieImage && (
        <MainImage
          image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
          title={MainMovieImage.original_title}
          text={MainMovieImage.overview}
        />
      )}

      <div style={{ width: "85%", margin: "1rem auto" }}>
        <Button style={{ margin: 5 }} onClick={viewLatest}>
          Top Rated
        </Button>
        <Button style={{ margin: 5 }} onClick={viewPlaying}>
          Now Playing
        </Button>
        <Button style={{ margin: 5 }} onClick={viewPopular}>
          Popular Movies
        </Button>
        {!stateOne && (
          <div>
            <MovieByLatest />
          </div>
        )}
        {!stateTwo && (
          <div>
            <MovieByNowPlaying />
          </div>
        )}
        {!stateThree && (
          <div>
            <MovieByPopular />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={loadMoreItems}>Load More</Button>
      </div>
    </div>
  );
}

export default LandingPage;
