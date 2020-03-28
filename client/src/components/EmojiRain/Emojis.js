const EmojiThemes = Object.freeze({
  money: Symbol.for("EmojiThemes.money"),
  party: Symbol.for("EmojiThemes.party"),
  unicorn: Symbol.for("EmojiThemes.unicorn"),
});

const jackpotTheme = EmojiThemes.party;
const normalPrizeTheme = EmojiThemes.unicorn;
const Emojis = {
  [EmojiThemes.money]: {
    title: "Money",
    emojis: [
      "🤑",
      "💷",
      "💶",
      "💴",
      "💵",
      "💸",
      "💰",
      "🏧",
      "👛",
      "🏦",
      "💳",
      "💎",
    ],
  },
  [EmojiThemes.party]: {
    title: "Party",
    emojis: [
      "👯‍",
      "👯‍",
      "🥳",
      "🍾",
      "🥂",
      "🎁",
      "👏",
      "🎂",
      "🎈",
      "🎉",
      "🎊",
    ],
  },
  [EmojiThemes.unicorn]: {
    title: "Unicorn",
    emojis: ["🦄", "🌈", "💫", "☁️", "💖"],
  },
};

const getRandomEmoji = ({ theme = normalPrizeTheme }) =>
  Emojis[theme].emojis[Math.floor(Math.random() * Emojis[theme].emojis.length)];

const getRandomEmojiSequence = ({ length = 10, theme = normalPrizeTheme }) => {
  let emojis = [];
  for (let i = 0; i < length; i++) {
    emojis.push(getRandomEmoji({ theme }));
  }

  return emojis.join("");
};

export default Emojis;
export {
  normalPrizeTheme,
  jackpotTheme,
  getRandomEmoji,
  getRandomEmojiSequence,
};
