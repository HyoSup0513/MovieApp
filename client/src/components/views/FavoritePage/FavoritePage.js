import React, { useEffect, useState } from "react";
import "./favorite.css";
import Axios from "axios";
import { Button, Typography, Popover } from "antd";
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";
const { Title } = Typography;

function FavoritePage() {
  const [Favorites, setFavorites] = useState([]);
  const [Loading, setLoading] = useState(true);
  let variable = { userFrom: localStorage.getItem("userId") };

  useEffect(() => {
    fetchFavoritedMovie();
  }, []);

  // Fetch F
  const fetchFavoritedMovie = () => {
    Axios.post("/api/favorite/getFavoritedMovie", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.favorites);
        setFavorites(response.data.favorites);
        setLoading(false);
      } else {
        alert("Failed to get favorite info");
      }
    });
  };

  const onClickDelete = (movieId, userFrom) => {
    const variables = {
      movieId: movieId,
      userFrom: userFrom,
    };

    Axios.post("/api/favorite/removeFromFavorite", variables).then(
      (response) => {
        if (response.data.success) {
          fetchFavoritedMovie();
        } else {
          alert("Failed to Remove From Favorite");
        }
      }
    );
  };

  const renderCards = Favorites.map((favorite, index) => {
    const content = (
      <div>
        {favorite.moviePost ? (
          <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} />
        ) : (
          "no image"
        )}
      </div>
    );

    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.movieTitle}`}>
          <td>{favorite.movieTitle}</td>
        </Popover>

        <td>{favorite.movieRunTime} mins</td>
        <td>
          <Button
            onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}
          >
            Remove
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> My Favorite Movies</Title>
      <hr />

      <table>
        <tbody>
          <tr>
            <th>{"Movie Title"}</th>
            <th>Movie Runtime</th>
            <td>Remove from favorite</td>
          </tr>
        </tbody>

        <tbody>{renderCards}</tbody>
      </table>
    </div>
  );
}

export default FavoritePage;
