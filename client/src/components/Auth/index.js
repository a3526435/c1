import React from "react";
import { MetaMaskButton } from "rimble-ui";

export default function Auth(props) {
  const { web3Context } = props;
  const requestAuth = async (web3Context) => {
    try {
      await web3Context.requestAuth();
      console.log(web3Context);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MetaMaskButton.Outline onClick={() => requestAuth(web3Context)}>
      Connect with MetaMask
    </MetaMaskButton.Outline>
  );
}
