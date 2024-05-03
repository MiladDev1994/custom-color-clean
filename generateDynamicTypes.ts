const { readdirSync, writeFileSync } = require("fs")

const iconDirectory = './assets/icons'
const iconNames = readdirSync(iconDirectory);
let IconNameFileText = `
const svgsNames = [
`;
iconNames.forEach((item) => {
  IconNameFileText += ` '${item.replace(".svg", "")}',\n`;
});
IconNameFileText += `] as const

export type SvgsNames = typeof svgsNames[number];`
writeFileSync(`${__dirname}/src/view/Components/Common/Icon/IconName.ts`, IconNameFileText)
