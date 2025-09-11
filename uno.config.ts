import {
  defineConfig,
  presetIcons,
  presetWind3,
} from 'unocss'

export default defineConfig({
  rules: [
    ['custom-rule', { color: 'red' }],
    [
      'truncate-multiline',
      {
        'display': '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': '3',
        'line-clamp': '3',
        'overflow': 'hidden',
        'line-height': '1.5',
        'height': '4.5em',
        'text-overflow': 'ellipsis',
        'color': '#6b7280',
      },
    ],
  ],
  shortcuts: {
    'clear-link': 'text-#222222 no-underline',
  },
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
})
