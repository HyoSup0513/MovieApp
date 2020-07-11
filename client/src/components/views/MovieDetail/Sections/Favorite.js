import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button } from "antd";

function Favorite(props) {
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
    if (Favorited) {
      // Remove from favorite
      Axios.post("/api/favorite/removeFromFavorite", variables).then(
        (response) => {
          if (response.data.success) {
            setFavoriteNumber(FavoriteNumber - 1);
            setFavorited(!Favorited);
          } else {
            alert("Failed to Remove From Favorite");
          }
        }
      );
    } else {
      // Add to favorite
      Axios.post("/api/favorite/addToFavorite", variables).then((response) => {
        if (response.data.success) {
          setFavoriteNumber(FavoriteNumber + 1);
          setFavorited(!Favorited);
        } else {
          alert("Failed to Add To Favorite");
        }
      });
    }
  };

  useEffect(() => {
    Axios.get("/api/favorite/favoriteNumber", variables).then((response) => {
      console.log(response.data);
      setFavoriteNumber(response.data.FavoriteNumber);
      if (response.data.success) {
      } else {
        alert("Failed to get number of favorites.");
      }
    });

    Axios.post("/api/favorite/favorited", variables).then((response) => {
      console.log(response.data);
      setFavorited(response.data.Favorited);
      if (response.data.success) {
      } else {
        alert("Failed to get favorite data.");
      }
    });
  }, []);

  return (
    <Button onClick={onClickFavorite}>
      {!Favorited ? "Add to Favorite" : "Not Favorite"} {"  "} {FavoriteNumber}
    </Button>
  );
}

export default Favorite;
