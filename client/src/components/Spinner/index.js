import React from "react";
import Reel from "./Reel";
import "./main.css";
import { Grid } from "semantic-ui-react";

export default function Spinner(props) {
  const { reels, currentReel, spinner } = props;
  return (
    <Grid vertically="true" centered>
      {reels.map((reelItem, index) => (
        <Reel
          reelItem={reelItem}
          key={index}
          selectedReel={currentReel[index]}
          spinner={spinner}
        />
      ))}
    </Grid>
  );
}

