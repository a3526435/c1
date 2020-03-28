import React from "react";
import Reel from "./Reel";
import { Grid } from "semantic-ui-react";
import "./main.css";
import styles from "../../Neo.module.scss";

export default function Spinner(props) {
  const { reels, currentReel, spinner } = props;
  return (
    <Grid vertically="true" centered className={styles.container}>
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
