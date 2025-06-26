export default {
  trailingComma: 'all',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  bracketSameLine: false,
  printWidth: 100,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@(fameex|ee)/(.*)$', '^@/(.*)$', '^[./]'],
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    /**
     * **NOTE** tailwind plugin must come last!
     * @see ​https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
     */
    'prettier-plugin-tailwindcss',
  ],
  tailwindFunctions: ['tv', 'cn'],
  ignorePatterns: ['**/*.mjs'],
}