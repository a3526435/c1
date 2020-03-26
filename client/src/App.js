import React, { useState, useEffect } from "react";
import { useWeb3Injected } from "@openzeppelin/network/react";
import { Grid, Container, Button } from "semantic-ui-react";
import ETHSlotMachine from "../../contracts/ETHSlotMachine.sol";
import Banner from "./components/Banner";
import Stats from "./components/Stats";
import Activity from "./components/Activity";
import Spinner from "./components/Spinner";

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
      getBalance(injected);
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
    if (log[1] !== "deposit" && log[1] !== "lose") {
      setLogs([{ player: log[0], message: log[1], value: log[2] }, ...logs]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBalance(injected);
    getContract(injected);
  }, [injected, injected.accounts, injected.networkId]);

  return (
    <Container>
      <Banner balance={balance} />
      <Grid>
        <Grid.Row columns={3} textAlign="center">
          <Stats state={state} />
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column textAlign="center">
            <Spinner />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Activity logs={logs} web3={injected} />
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
  );
}

export default App;
