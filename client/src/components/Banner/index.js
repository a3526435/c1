import React from "react";
import { Container, Grid, Header } from "semantic-ui-react";

export default function Banner(props) {
  return (
    <Container style={{ margin: "3em" }}>
      <Grid divided="vertically" columns={2}>
        <Grid.Column floated="left" textAlign="left">
          <Header content="ETHSlotMachine" />
        </Grid.Column>
        <Grid.Column floated="right" textAlign="right">
          <Header content={`${Number(props.balance).toFixed(5)} ETH`} />
        </Grid.Column>
      </Grid>
    </Container>
  );
}
