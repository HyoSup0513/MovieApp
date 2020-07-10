import React from "react";
import { Col } from "antd";
import { IMAGE_BASE_URL } from "../../Config";

function GridCards(props) {
  let { key, image, movieId, movieName, characterName } = props;

  if (props.actor) {
    return (
      <Col key={key} lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <img
            style={{ width: "100%", height: "320px" }}
            alt={characterName}
            src={image}
          />
        </div>
      </Col>
    );
  } else {
    return (
      <Col key={key} lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <a href={`/movie/${movieId}`}>
            <img
              style={{ width: "100%", height: "320px" }}
              alt={movieName}
              src={image}
            />
          </a>
        </div>
      </Col>
    );
  }
}

export default GridCards;
