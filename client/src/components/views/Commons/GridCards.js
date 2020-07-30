import React from "react";
import { Col } from "antd";
import { IMAGE_BASE_URL } from "../../Config";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(10,10,10,10,10) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

function GridCards(props) {
  let { key, image, movieId, movieName, characterName, movieRate } = props;
  const classes = useStyles();

  if (props.actor) {
    return (
      <Col key={key} lg={3} md={8} xs={12}>
        <GridListTile key={key}>
          <img src={image} />
          <GridListTileBar
            title={characterName}
            classes={{
              root: classes.titleBar,
              title: classes.title,
            }}
          />
        </GridListTile>
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
            <GridListTileBar
              title={movieRate}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
          </a>
        </div>
      </Col>
    );
  }
}

export default GridCards;
