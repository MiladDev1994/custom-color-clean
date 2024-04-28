
const fs = require("fs")
const readDefaultSeedData = fs.readdirSync(`${process.cwd()}/configs/defaultSeedData`)
// this.data = JSON.parse(readDefaultSeedData)
// console.log(readDefaultSeedData)



let data = {}
const configPath = `${process.cwd()}/configs/defaultSeedData`

readDefaultSeedData.forEach((item) => {
    createSorterDefaultConfigs(`D:\\workspace\\03_Projects\\sorter-custom-program-creator\\sorter-custom-program-creator-clean\\configs\\defaultSeedData\\${item}`).then((res) => {
        const [DefaultSorterConfig, DefaultFilters, Translator] = res
        console.log(DefaultSorterConfig, DefaultFilters, Translator)
        data[item].DefaultSorterConfig = DefaultSorterConfig
        data[item].DefaultFilters = DefaultFilters
        data[item].Translator = Translator
    });

})

