import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
    rules: {
      // Tambahkan aturan khusus jika diperlukan
    },
  },
  pluginJs.configs.recommended,
  {
    overrides: [
      {
        files: ['*.js'],
        rules: {
          // Aturan khusus untuk file JavaScript
        },
      },
    ],
  },
]
