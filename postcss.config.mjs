// Layout is authored in px against the 1024px mockup, then converted to rem.
// html font-size scales with viewport (see globals.css), so the page scales
// proportionally like the mockup on wider screens.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-pxtorem": { rootValue: 16, propList: ["*"], selectorBlackList: [] },
  },
};
export default config;
