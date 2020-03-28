import React from "react";
import { Card, Feed, Image } from "semantic-ui-react";
import { Blockie } from "rimble-ui";
import styles from "../../Neo.module.scss";

export default function Activity(props) {
  const { winners, web3 } = props;

  return (
    <Card className={styles.container}>
      <Card.Content>
        <Card.Header content="Recent Winner" style={{ fontSize: "1em" }} />
      </Card.Content>
      <Card.Content style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Feed>
          {winners.map((value, index) => (
            <Feed.Event
              key={index + winners[winners.length - index - 1].player}
              className="transition fade in"
            >
              <Feed.Label style={{ paddingTop: "5px" }}>
                <Image
                  as={Blockie}
                  opts={{
                    seed: winners[winners.length - index - 1].player,
                    bgcolor: `#${winners[
                      winners.length - index - 1
                    ].player.slice(3, 9)}`,
                    color: "#fff",
                    size: 10,
                    scale: 3,
                  }}
                />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date
                  content={winners[winners.length - index - 1].message}
                />
                <Feed.Summary
                  content={Number(
                    web3.lib.utils.fromWei(
                      winners[winners.length - index - 1].value,
                      "ether"
                    )
                  ).toFixed(4)}
                />
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </Card.Content>
    </Card>
  );
}
