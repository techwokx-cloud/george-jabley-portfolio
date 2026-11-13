// Layout is authored in px against the 1024px mockup, then converted to rem.
// html font-size scales with viewport (see globals.css), so the page scales
// proportionally like the mockup on wider screens. The admin stylesheet is excluded
// so the dashboard stays a normal fixed-size UI.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-pxtorem": { rootValue: 16, propList: ["*"], selectorBlackList: [], exclude: /(admin|portfolio)\.css$/ },
  },
};
export default config;
