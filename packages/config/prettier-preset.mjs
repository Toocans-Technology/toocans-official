/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

export default {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  bracketSameLine: false,
  printWidth: 120,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@(workspace|ee)/(.*)$', '^@/(.*)$', '^[./]'],
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