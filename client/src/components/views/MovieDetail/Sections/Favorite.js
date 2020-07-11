import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button } from "antd";
import { useSelector } from "react-redux";

function Favorite(props) {
  const user = useSelector((state) => state.user);

  const movieId = props.movieId;
  const userFrom = props.userFrom;
  const movieTitle = props.movieinfo.title;
  const moviePost = props.movieinfo.backdrop_path;
  const movieRunTime = props.movieinfo.runtime;

  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const [Favorited, setFavorited] = useState(false);
  const variables = {
    userFrom,
    movieId,
    movieTitle,
    moviePost,
    movieRunTime,
  };

  const onClickFavorite = () => {
    if (user.userData && !user.userData.isAuth) {
      return alert("Please Log in first");
    }

    if (Favorited === true) {
      // Remove from favorite
      Axios.post("/api/favorite/removeFromFavorite", variables).then(
        (response) => {
          if (response.data.success) {
            setFavoriteNumber(FavoriteNumber - 1);
            setFavorited(false);
          } else {
            alert("Failed to Remove From Favorite");
          }
        }
      );
    } else if (Favorited === false) {
      // Add to favorite
      Axios.post("/api/favorite/addToFavorite", variables).then((response) => {
        if (response.data.success) {
          setFavoriteNumber(FavoriteNumber + 1);
          setFavorited(true);
        } else {
          alert("Failed to Add To Favorite");
        }
      });
    }
  };

  useEffect(() => {
    Axios.post("/api/favorite/favoriteNumber", variables).then((response) => {
      if (response.data.success) {
        setFavoriteNumber(response.data.favoriteNumber);
      } else {
        alert("Failed to get number of favorites.");
      }
    });

    Axios.post("/api/favorite/favorited", variables).then((response) => {
      if (response.data.favorited === true) {
        setFavorited(true);
      } else if (response.data.favorited === false) {
        setFavorited(false);
      } else {
        alert("Error");
      }
    });
  }, []);

  // useEffect(() => {
  //   Axios.get("/api/favorite/favorited", variables).then((response) => {
  //     if (response.data.favorited === true) {
  //       setFavorited(true);
  //     } else if (response.data.favorited === false) {
  //       setFavorited(false);
  //     } else {
  //       alert("Error");
  //     }
  //   });
  // }, []);

  return (
    <Button onClick={onClickFavorite}>
      {!Favorited ? "Add to Favorite" : "Not Favorite"} {"  "} {FavoriteNumber}
    </Button>
  );
}

export default Favorite;
