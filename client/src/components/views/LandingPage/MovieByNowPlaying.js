import React, { useEffect, useState, useRef } from "react";
import { Typography, Row, Button } from "antd";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  IMAGE_SIZE,
  POSTER_SIZE,
} from "../../Config";
import GridCards from "../Commons/GridCards";
const { Title } = Typography;

function MovieByNowPlaying() {
  const [Movies, setMovies] = useState([]);
  const [MainMovieImage, setMainMovieImage] = useState(null);
  const [CurrentPage, setCurrentPage] = useState(0);

  // Main Page's image
  useEffect(() => {
    const endpoint = `${API_URL}movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint);
  }, []);

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        // Just add state
        setMovies([...Movies, ...result.results]);
        setMainMovieImage(result.results[0]);
        setCurrentPage(result.page);
      });
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {/* Grid Cards */}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <h2> Now Playing </h2>
        <hr />
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.map((movie, index) => (
              <React.Fragment key={index}>
                <GridCards
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              </React.Fragment>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default MovieByNowPlaying;
