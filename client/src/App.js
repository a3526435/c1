import React, { useState, useEffect } from "react";
import { useWeb3Injected } from "@openzeppelin/network/react";
import {
  Grid,
  Container,
  Header,
  Button,
  List,
  Image,
  Feed,
} from "semantic-ui-react";
import { Blockie } from "rimble-ui";
import ETHSlotMachine from "../../contracts/ETHSlotMachine.sol";

import styles from "./App.module.scss";

function App() {
  const injected = useWeb3Injected();
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [state, setState] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBalance = async (web3Context) => {
    const accounts = web3Context.accounts;
    const lib = web3Context.lib;
    let balance =
      accounts && accounts.length > 0
        ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), "ether")
        : "Unknown";
    setBalance(balance);
  };

  const getContract = async (web3Context) => {
    let deployedNetwork = null;
    let instance = null;
    if (ETHSlotMachine.networks) {
      deployedNetwork = ETHSlotMachine.networks[web3Context.networkId];
      if (deployedNetwork) {
        instance = new injected.lib.eth.Contract(
          ETHSlotMachine.abi,
          deployedNetwork.address
        );
      }
    }
    setContract(instance);
    refreshValues(instance);
  };

  const refreshValues = async (instance) => {
    if (instance) {
      setState({
        ...state,
        total: await instance.methods.total().call(),
        win: await instance.methods.win().call(),
        pot: injected.lib.utils.fromWei(
          await instance.methods.pot().call(),
          "ether"
        ),
        price: injected.lib.utils.fromWei(
          await instance.methods.price().call(),
          "ether"
        ),
      });
    }
  };

  const getLucky = async () => {
    setLoading(true);
    let response;
    if (contract) {
      await contract.methods
        .getLucky()
        .send({
          from: injected.accounts[0],
          value: injected.lib.utils.toWei(state.price),
        })
        .on("receipt", (receipt) => {
          response = receipt;
        });
    }
    refreshValues(contract);
    let log = response.events["Response"].returnValues;
    setLogs([...logs, { player: log[0], message: log[1], value: log[2] }]);
    setLoading(false);
  };

  useEffect(() => {
    getBalance(injected);
    getContract(injected);
  }, [injected, injected.accounts, injected.networkId]);

  return (
    <>
      <Container>
        <Container style={{ margin: "3em" }}>
          <Grid divided="vertically" columns={2}>
            <Grid.Column floated="left" textAlign="left">
              <Header content="ETHSlotMachine" />
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              <Header content={`${Number(balance).toFixed(5)} ETH`} />
            </Grid.Column>
          </Grid>
        </Container>
        <Grid>
          <Grid.Row columns={3} textAlign="center">
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
          </Grid.Row>
          <Grid.Row>
            <h1>spinner animation</h1>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Feed>
                {logs.map((log, index) => (
                  <Feed.Event key={index + log}>
                    <Feed.Label>
                      <Image
                        as={Blockie}
                        opts={{ seed: log.player, size: 10 }}
                      />
                    </Feed.Label>
                    <Feed.Content>
                      <Feed.Date content={log.message} />
                      <Feed.Summary
                        content={Number(
                          injected.lib.utils.fromWei(log.value, "ether")
                        ).toFixed(4)}
                      />
                    </Feed.Content>
                  </Feed.Event>
                ))}
              </Feed>
            </Grid.Column>
            <Grid.Column>
              <Button
                primary
                fluid
                content="Play"
                onClick={getLucky}
                loading={loading}
                disabled={loading}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

export default App;
