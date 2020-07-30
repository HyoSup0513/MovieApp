import React, { useEffect, useState } from "react";
import MainImage from "../Commons/MainImage";
import MovieInfo from "./Sections/MovieInfo";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";
import GridCards from "../Commons/GridCards";
import { Row } from "antd";
import Favorite from "./Sections/Favorite";
import Comment from "./Sections/Comments";
import Axios from "axios";
import { Button } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
}));

function MovieDetail(props) {
  // Get movie id
  let movieId = props.match.params.movieId;

  const [Movie, setMovie] = useState([]);
  const [Casts, setCasts] = useState([]);
  const [ActorToggle, setActorToggle] = useState(false);
  const [CommentLists, setCommentLists] = useState([]);
  const movieVariable = {
    movieId: movieId,
  };
  const classes = useStyles();

  useEffect(() => {
    // Information of Crew
    let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
    let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;

    fetch(endpointInfo)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMovie(response);
      });

    fetch(endpointCrew)
      .then((response) => response.json())
      .then((response) => {
        console.log("responseForCrew", response);
        setCasts(response.cast);
      });

    Axios.post("/api/comment/getComments", movieVariable).then((response) => {
      console.log(response);
      if (response.data.success) {
        console.log("response.data.comments", response.data.comments);
        setCommentLists(response.data.comments);
      } else {
        alert("Failed to get comments Info");
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };
  const toggleActorView = () => {
    setActorToggle(!ActorToggle);
  };

  return (
    <div>
      {/* Header */}
      <MainImage
        image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
        title={Movie.original_title}
        text={Movie.overview}
      />

      <div style={{ witdh: "85%", margin: "1rem auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Favorite
            movieinfo={Movie}
            movieId={movieId}
            userFrom={localStorage.getItem("userId")}
          />
        </div>
      </div>

      {/*  Movie Info */}
      <MovieInfo movie={Movie} />

      <br />
      {/* Actor Grid */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "2rem" }}
      >
        <Button onClick={toggleActorView}> Toggle Actor View</Button>
      </div>

      <div className={classes.root}>
        <GridList className={classes.gridList} cols={1.2}>
          {ActorToggle && (
            <Row gutter={[16, 16]}>
              {Casts &&
                Casts.map((cast, index) => (
                  <React.Fragment key={index}>
                    <GridCards
                      actor
                      image={
                        cast.profile_path
                          ? `${IMAGE_BASE_URL}${POSTER_SIZE}${cast.profile_path}`
                          : undefined
                      }
                      characterName={cast.name}
                    />
                  </React.Fragment>
                ))}
            </Row>
          )}
        </GridList>
      </div>

      <div>
        {/* Comments */}
        <Comment
          title={Movie.original_title}
          CommentLists={CommentLists}
          postId={movieId}
          refreshFunction={updateComment}
        />
      </div>
    </div>
  );
}

export default MovieDetail;
