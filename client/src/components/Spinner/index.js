import React from "react";

import Reel from "./Reel";
import "./main.css";

export default function Spinner(props) {
  const { reels, currentReel, spinner } = props;
  return (
    <div className="app">
      <div className="slot">
        <div className="slot__slot-container">
          {reels.map((reelItem, index) => (
            <Reel
              reelItem={reelItem}
              key={index}
              selectedReel={currentReel[index]}
              spinner={spinner}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

