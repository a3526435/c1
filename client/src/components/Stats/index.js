import React from "react";
import { Grid, Header } from "semantic-ui-react";

export default function Stats(props) {
  const { state } = props;
  return (
    <>
      <Grid.Column>
        {"Winning Odds"}
        <Header as="h3">
          {`${
            state.win / state.total
              ? ((state.win / state.total) * 100).toFixed(3)
              : 0
          } %`}
        </Header>
      </Grid.Column>
      <Grid.Column>
        {"Current Pot"}
        <Header as="h3">
          {`${state.pot ? Number(state.pot).toFixed(4) : 0} ETH`}
        </Header>
      </Grid.Column>
      <Grid.Column>
        {"Entry Price"}
        <Header as="h3">
          {`${state.price ? Number(state.price).toFixed(2) : 0} ETH`}
        </Header>
      </Grid.Column>
    </>
  );
}
