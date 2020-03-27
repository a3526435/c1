import React, { Component } from "react";
import { throttle } from "lodash";
import "./EmojiRain.css";
import EmojiCanvas from "./EmojiCanvas";
import {
  getRandomEmoji,
  EmojiThemes,
  jackpotTheme,
  normalPrizeTheme,
} from "./Emojis";

class EmojiRain extends Component {
  static defaultProps = {
    maxDrops: 200,
    minFontSize: 40,
    maxFontSize: 150,
    theme: normalPrizeTheme,
  };

  getRandomNegativeInnerHeight = () =>
    Math.min(-this.props.maxFontSize, Math.random() * -window.innerHeight);

  getRandomNegativeInnerWidth = () =>
    Math.min(-this.props.maxFontSize, Math.random() * -window.innerWidth);

  generateDrops = ({
    minFontSize,
    maxFontSize,
    maxDrops,
    innerHeight,
    innerWidth,
    speed,
    theme,
  }) => {
    let drops = [];
    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        fontSize: Math.max(minFontSize, Math.ceil(Math.random() * maxFontSize)),
        emoji: getRandomEmoji({ theme }),
        position: {
          x: -innerWidth / 2 / 1.5 + Math.random() * innerWidth * 1.5,
          y: -innerWidth / 2 / 1.5 + Math.random() * innerHeight * 1.5,
        },
        delta: {
          x: speed / 2 - Math.random() * speed,
        },
      });
    }

    return drops;
  };

  constructor(props) {
    super(props);

    const { minFontSize, maxFontSize, maxDrops, theme } = props;
    const { innerWidth, innerHeight } = window;

    const speed = 0.3;
    const drops = this.generateDrops({
      minFontSize,
      maxFontSize,
      maxDrops,
      innerHeight,
      innerWidth,
      speed,
      theme,
    });

    this.state = {
      drops,
      innerHeight,
      innerWidth,
      isDarkMode: false,
      lastUpdate: new Date().getTime(),
      speed,
      theme,
    };

    this.animationFrame = requestAnimationFrame(this.handleAnimationFrame);
    window.addEventListener("resize", this.throttledResize);
  }

  componentWillMount() {
    const { innerHeight, innerWidth } = window;
    const { innerHeight: currentHeight, innerWidth: currentWidth } = this.state;

    if (innerHeight !== currentHeight || innerWidth !== currentWidth) {
      this.setState({
        innerHeight,
        innerWidth,
      });
    }
  }

  handleResize = () =>
    this.setState({
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    });
  throttledResize = throttle(this.handleResize, 250);

  getUpdatedPosition = ({ for: drop, deltaTime }) => {
    const { maxFontSize } = this.props;
    const { innerHeight, innerWidth, speed } = this.state;

    if (drop.position.x < -maxFontSize) {
      drop.position.x = innerWidth + maxFontSize;
    } else if (drop.position.x > innerWidth + maxFontSize) {
      drop.position.x = this.getRandomNegativeInnerWidth();
    } else {
      drop.position.x = drop.position.x + drop.delta.x * speed * deltaTime;
    }

    if (drop.position.y > innerHeight + maxFontSize) {
      drop.position.y = this.getRandomNegativeInnerHeight();
    } else {
      drop.position.y = drop.position.y + speed * deltaTime;
    }

    return drop.position;
  };

  handleAnimationFrame = () => {
    this.animationFrame = requestAnimationFrame(this.handleAnimationFrame);

    const deltaTime = new Date().getTime() - this.state.lastUpdate;

    const drops = this.state.drops.map((drop) => ({
      ...drop,
      emoji: drop.emoji,
      position: this.getUpdatedPosition({ for: drop, deltaTime }),
    }));

    this.setState({
      drops,
      lastUpdate: new Date().getTime(),
    });
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.throttledResize);
  }

  render() {
    const {
      drops,
      innerHeight,
      innerWidth,
      isDarkMode,
      speed,
      theme,
      title,
    } = this.state;

    return (
      <>
        <EmojiCanvas
          drops={drops}
          height={innerHeight}
          isDarkMode={isDarkMode}
          width={innerWidth}
        />
      </>
    );
  }
}

export default EmojiRain;
