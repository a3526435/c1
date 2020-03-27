import React from "react";

const black = "rgba(0, 0, 0, 1)";
const white = "rgba(255, 255, 255, 1)";

const updateContext = ({ context, isDarkMode, drops, width, height }) => {
  context.clearRect(0, 0, width, height);
  context.fillStyle = isDarkMode ? black : white;
  context.fillRect(0, 0, width, height);

  for (let i = 0, l = drops.length; i < l; i++) {
    context.font = `${drops[i].fontSize}px serif`;
    context.fillText(
      drops[i].emoji,
      Math.floor(drops[i].position.x),
      Math.floor(drops[i].position.y)
    );
  }
};

const EmojiCanvas = ({ isDarkMode, drops, height, width }) => {
  const canvasElement = React.useRef(null);
  const [context, setContext] = React.useState(null);

  if (canvasElement.current) {
    if (!context) {
      setContext(canvasElement.current.getContext("2d"));
    } else {
      canvasElement.current.width = width;
      canvasElement.current.height = height;
      updateContext({ context, isDarkMode, drops, width, height });
    }
  }

  return <canvas className="EmojiRainCanvas" ref={canvasElement} />;
};

export default EmojiCanvas;
