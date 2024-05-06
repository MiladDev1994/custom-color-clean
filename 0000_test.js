
const filters = [
    {id: 1, name: "milad1"},
    {id: 2, name: "milad2"},
    {id: 3, name: "milad3"}
]

const oldFilters = [...filters]
const findIndex = oldFilters.findIndex(ele => ele.id === 2)
const spliceFilters = oldFilters.splice(findIndex, 1)
const newFilter = {
    ...spliceFilters[0],
    name: "milad5"
}
oldFilters.splice(findIndex, 0, newFilter)
console.log(oldFilters)