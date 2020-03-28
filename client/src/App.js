import React, { useState, useEffect } from "react";
import { useWeb3Injected, useWeb3Network } from "@openzeppelin/network/react";
import { Grid, Container, Button } from "semantic-ui-react";
//import ETHSlotMachine from "../../contracts/ETHSlotMachine.sol";
import ETHSlotMachine from "./abi/ETHSlotMachine.json";
import Banner from "./components/Banner";
import Stats from "./components/Stats";
import Activity from "./components/Activity";
import Spinner from "./components/Spinner";
import Auth from "./components/Auth";
import EmojiRain from "./components/EmojiRain";
import styles from "./Neo.module.scss";

function App() {
  const metamask = window.ethereum;
  const wallet = useWeb3Injected();
  const infuraToken = "95e3823c0f62479f84423148141a37c2";
  const infura = useWeb3Network(
    `wss://rinkeby.infura.io/ws/v3/${infuraToken}`,
    {
      pollInterval: 10 * 1000,
    }
  );

  const injected = wallet ? wallet : infura;
  const [isOwner, setIsOwner] = useState(false);
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

  const getBalance = async (web3Context, metamask) => {
    const lib = web3Context.lib;

    const account = metamask
      ? metamask.selectedAddress
      : web3Context.accounts[0];
    if (account) {
      let balance =
        account && account.length > 0
          ? lib.utils.fromWei(await lib.eth.getBalance(account), "ether")
          : "Unknown";
      setBalance(balance);
    }
  };

  const getContract = async (web3Context) => {
    let deployedNetwork = null;
    let instance = null;
    if (ETHSlotMachine.networks) {
      deployedNetwork = ETHSlotMachine.networks[web3Context.networkId];
      if (deployedNetwork) {
        instance = new web3Context.lib.eth.Contract(
          ETHSlotMachine.abi,
          deployedNetwork.address
            ? deployedNetwork.address
            : "0xE253bbA5e2b71960B0B7328D04b8480b16a00706"
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
      setIsOwner(
        await instance.methods.isOwner().call({ from: injected.accounts[0] })
      );
    }
  };

  const loadMoney = async () => {
    setLoading(true);
    await injected.lib.eth.sendTransaction({
      from: metamask ? metamask.selectedAddress : injected.accounts[0],
      to: contract._address,
      value: injected.lib.utils.toWei(state.price),
    });
    refreshValues(contract);
    setLoading(false);
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
            from: metamask ? metamask.selectedAddress : injected.accounts[0],
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
        setWin(Number(log[2]));
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

  //console.log(metamask);

  useEffect(() => {
    getBalance(injected, metamask);
    getContract(injected);
    setTimeout(() => {
      setSpinner(false);
    }, 1000);
  }, [injected, injected.accounts, injected.networkId, metamask]);

  return (
    <>
      {win > -1 && win < 5 ? (
        <EmojiRain jackpot={win === 0 ? true : false} />
      ) : (
        <></>
      )}
      <Container className={styles.neoApp}>
        <Banner balance={balance} />
        <Grid>
          {win > 0 && win <= 5 ? (
            <Grid.Row
              as="h3"
              centered
              className={styles.container}
              style={{ marginBottom: "4vh" }}
            >
              {win === 5
                ? "Better luck next time"
                : win === 0
                ? "JACKPOT!!!"
                : `You ${logs[0]["message"]}`}
            </Grid.Row>
          ) : (
            <></>
          )}
          <Grid.Row columns={3} textAlign="center" className={styles.container}>
            <Stats state={state} />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center" style={{ marginTop: "4vh" }}>
              <Spinner
                reels={reels}
                currentReel={currentReel}
                spinner={spinner}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={isOwner ? 3 : 2} style={{ marginTop: "4vh" }}>
            <Grid.Column>
              <Activity
                logs={logs}
                web3={injected}
                className={styles.container}
              />
            </Grid.Column>
            {isOwner ? (
              <Grid.Column>
                <Button
                  fluid
                  loading={loading}
                  content="load"
                  onClick={loadMoney}
                  disabled={loading}
                  className={styles.neoBtn}
                />
              </Grid.Column>
            ) : (
              <></>
            )}
            <Grid.Column floated="right">
              {injected.accounts && injected.accounts.length ? (
                <Button
                  fluid
                  content="Play"
                  onClick={getLucky}
                  loading={loading}
                  disabled={loading}
                  className={styles.neoBtn}
                />
              ) : (
                <Auth web3Context={metamask ? metamask : injected} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

export default App;
