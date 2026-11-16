import parser from '@typescript-eslint/parser'
import reactHooks from 'eslint-plugin-react-hooks'
import view from './tooling/architecture/view-rule.mjs'

export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    linterOptions: { noInlineConfig: true },
    plugins: { architecture: { rules: { view } }, 'react-hooks': reactHooks },
    rules: {
      'max-lines': [
        'error',
        { max: 120, skipBlankLines: false, skipComments: false },
      ],
      'architecture/view': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message: 'Declare functions as const arrow functions.',
        },
        { selector: 'FunctionExpression', message: 'Use an arrow function.' },
      ],
    },
  },
]
