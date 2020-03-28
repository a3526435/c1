import React from "react";
import { Card, Feed, Image } from "semantic-ui-react";
import { Blockie } from "rimble-ui";
import styles from "../../Neo.module.scss";

export default function Activity(props) {
  const { logs, web3 } = props;
  return (
    <Card className={styles.container}>
      <Card.Content>
        <Card.Header content="Recent Winner" style={{ fontSize: "1em" }} />
      </Card.Content>
      <Card.Content style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Feed>
          {logs.map((log, index) => (
            <Feed.Event key={index + log} className="transition fade in">
              <Feed.Label style={{ paddingTop: "5px" }}>
                <Image
                  as={Blockie}
                  opts={{
                    seed: log.player,
                    size: 10,
                    scale: 3,
                  }}
                />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date content={log.message} />
                <Feed.Summary
                  content={Number(
                    web3.lib.utils.fromWei(log.value, "ether")
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
