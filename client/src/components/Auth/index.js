import React, { useCallback } from "react";
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
  const requestAccess = useCallback(() => requestAuth(web3Context), []);

  return (
    <MetaMaskButton.Outline onClick={requestAccess}>
      Connect with MetaMask
    </MetaMaskButton.Outline>
  );
}
