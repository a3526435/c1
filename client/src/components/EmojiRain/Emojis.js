const EmojiThemes = Object.freeze({
  balloon: Symbol.for('EmojiThemes.balloon'),
  cat: Symbol.for('EmojiThemes.cat'),
  fastFood: Symbol.for('EmojiThemes.fastFood'),
  german: Symbol.for('EmojiThemes.german'),
  hipster: Symbol.for('EmojiThemes.hipster'),
  money: Symbol.for('EmojiThemes.money'),
  party: Symbol.for('EmojiThemes.party'),
  unicorn: Symbol.for('EmojiThemes.unicorn'),
})

const defaultTheme = EmojiThemes.party
const Emojis = {
  [EmojiThemes.balloon]: {
    title: 'Balloon',
    emojis: ['🎈'],
  },
  [EmojiThemes.cat]: {
    title: 'Cat',
    emojis: [
      '😸',
      '🐈',
      '😹',
      '😺',
      '😻',
      '😼',
      '😼',
      '😽',
      '😾',
      '😿',
      '🙀',
      '🐱',
      '🐅',
      '🐆',
      '🧶',
    ],
  },
  [EmojiThemes.fastFood]: {
    title: 'Fast food',
    emojis: [
      '🍔',
      '🍟',
      '🍕',
      '🌭',
      '🥙',
      '🥪',
      '🌮',
      '🌯',
      '🍩',
      '🥤',
      '🍿',
      '🍫',
    ],
  },
  [EmojiThemes.german]: {
    title: 'German',
    emojis: ['🍺', '🍻', '👩‍🌾', '👨‍🌾', '🇩🇪', '🥨', '🍖', '⚽️', '🥔'],
  },
  [EmojiThemes.hipster]: {
    title: 'Hipster',
    emojis: [
      '📝',
      '👩‍🎤',
      '👨‍🎤',
      '👨‍💻',
      '👩‍💻',
      '🎨',
      '🛍',
      '🎮',
      '👾',
      '🎪',
      '📰',
      '🎧',
      '🤳',
    ],
  },
  [EmojiThemes.money]: {
    title: 'Money',
    emojis: [
      '🤑',
      '💷',
      '💶',
      '💴',
      '💵',
      '💸',
      '💰',
      '🏧',
      '👛',
      '🏦',
      '💳',
      '💎',
    ],
  },
  [EmojiThemes.party]: {
    title: 'Party',
    emojis: [
      '👯‍',
      '👯‍',
      '🥳',
      '🍾',
      '🥂',
      '🎁',
      '👏',
      '🎂',
      '🎈',
      '🎉',
      '🎊',
    ],
  },
  [EmojiThemes.unicorn]: {
    title: 'Unicorn',
    emojis: ['🦄', '🌈', '💫', '☁️', '💖'],
  },
}

const getRandomEmoji = ({ theme = defaultTheme }) =>
  Emojis[theme].emojis[Math.floor(Math.random() * Emojis[theme].emojis.length)]

const getRandomEmojiSequence = ({ length = 10, theme = defaultTheme }) => {
  let emojis = []
  for (let i = 0; i < length; i++) {
    emojis.push(getRandomEmoji({ theme }))
  }

  return emojis.join('')
}

export default Emojis
export { EmojiThemes, defaultTheme, getRandomEmoji, getRandomEmojiSequence }
