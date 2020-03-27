import React from "react";
import ReactDOM from "react-dom";
import EmojiRain from "../components/EmojiRain";

it("renders without crashing", () => {
  const match = {
    params: {
      theme: "unicorn",
      background: "black",
    },
  };
  const div = document.createElement("div");
  ReactDOM.render(<EmojiRain match={match} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
