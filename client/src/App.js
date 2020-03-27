import React, { useState, useEffect } from "react";
import { useWeb3Injected } from "@openzeppelin/network/react";
import { Grid, Container, Header, Button } from "semantic-ui-react";
import ETHSlotMachine from "../../contracts/ETHSlotMachine.sol";
import Banner from "./components/Banner";
import Stats from "./components/Stats";
import Activity from "./components/Activity";
import Spinner from "./components/Spinner";
import Auth from "./components/Auth";
import EmojiRain from "./components/EmojiRain";

function App() {
  const injected = useWeb3Injected();
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [state, setState] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [win, setWin] = useState(-1);

  const reels = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 7, 5, 6],
    [0, 1, 2, 3, 4, 6, 7, 5],
  ];
  const [currentReel, setCurrentReel] = useState([
    { index: 0 },
    { index: 0 },
    { index: 0 },
  ]);
  const [spinner, setSpinner] = useState(true);

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

  const setNewCurrentReel = (prizeID) => {
    const newCurrentReel = reels.map((reel) => {
      const randNo = prizeID < 5 ? prizeID : 5;
      return {
        index: randNo,
        name: reel[randNo],
      };
    });

    setCurrentReel(newCurrentReel);
  };

  const getLucky = async () => {
    setWin(-1);
    setLoading(true);
    setSpinner(true);
    let response;
    if (contract) {
      try {
        await contract.methods
          .getLucky()
          .send({
            from: injected.accounts[0],
            value: injected.lib.utils.toWei(state.price),
          })
          .on("receipt", (receipt) => {
            response = receipt;
          });
        refreshValues(contract);
        let log = response.events["Response"].returnValues;
        if (log[1] !== "Deposit" && log[1] !== "Lose") {
          setLogs([
            { player: log[0], message: log[1], value: log[3] },
            ...logs,
          ]);
        }
        if (log[1] == "Lose") {
          setWin(0);
        } else {
          setWin(1);
        }
        setNewCurrentReel(Number(log[2]));
        setSpinner(false);
        setLoading(false);
      } catch (e) {
        //console.log(e);
        setSpinner(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getBalance(injected);
    getContract(injected);
    setTimeout(() => {
      setSpinner(false);
    }, 1000);
  }, [injected, injected.accounts, injected.networkId]);

  return (
    <>
      {win === 1 ? <EmojiRain /> : <></>}
      <Container>
        <Banner balance={balance} />
        <Grid>
          <Grid.Row columns={3} textAlign="center">
            <Stats state={state} />
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column textAlign="center">
              {win === 1 ? (
                <Header
                  as="h1"
                  content={`You ${logs[0]["message"]}`}
                  color="green"
                />
              ) : win === 0 ? (
                <Header as="h1" content="Please Try Again" color="orange" />
              ) : (
                <Header as="h1" content="Spin Me" style={{ color: "white" }} />
              )}
              <Spinner
                reels={reels}
                currentReel={currentReel}
                spinner={spinner}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Activity logs={logs} web3={injected} />
            </Grid.Column>
            <Grid.Column>
              {injected.accounts && injected.accounts.length ? (
                <Button
                  primary
                  fluid
                  content="Play"
                  onClick={getLucky}
                  loading={loading}
                  disabled={loading}
                />
              ) : (
                <Auth web3Context={injected} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

export default App;
