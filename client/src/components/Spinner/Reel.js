import React from "react";
import { Grid, Image } from "semantic-ui-react";
import Satoshi from "../../assets/satoshi.png";
import BTC from "../../assets/bitcoin.png";
import ETH from "../../assets/ethereum.png";
import Dai from "../../assets/dai.png";
import Kitty from "../../assets/kitty.png";
import Scammer from "../../assets/bitconnect.png";
import Fruad from "../../assets/craig.png";
import Pepe from "../../assets/pepe.png";

export default function Reel({ reelItem, selectedReel, spinner }) {
  const imgs = [Satoshi, BTC, ETH, Dai, Kitty, Scammer, Fruad, Pepe];
  return (
    <Grid.Column width="5" verticalAlign="middle">
      <div className="slot__reel-each">
        <div
          className={
            spinner
              ? "slot__reel-carousel"
              : "slot__reel-carousel slot__reel-carousel--stop"
          }
        >
          {selectedReel &&
            reelItem.map((each, index) => (
              <div
                key={index}
                className={
                  index === selectedReel.index
                    ? "slot__reel-cell slot__reel-cell--selected"
                    : spinner
                    ? "slot__reel-cell"
                    : "slot__reel-cell hide"
                }
              >
                <Image src={imgs[each]} className="img" />
              </div>
            ))}
        </div>
      </div>
    </Grid.Column>
  );
}
