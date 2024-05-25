
import { WriteFiltersFile } from "../handler/utils/WriteFiltersFile";
let FiltersInstance: any

class FiltersSingleton {
    filters: any[] = [];
    constructor() {
        if (FiltersInstance) {
          throw new Error("You can only create one instance!");
        }
        FiltersInstance = this;
    }

    async set(filter: any) {
        // await WriteFiltersFile()
        return this.filters = filter
    }
    
    async push(data: any) {
        const { 
            filter_name,
            filter_type, 
            size_type, 
            chart_type, 
            influenceTop, 
            influenceDown, 
            confusion = false,
            optimalPoint,
            images,
            result,
            userData,
            filterValues,
            HV_images
        } = data
        
        const findMaxId = this.filters.length ? this.filters.reduce((a: any, b: any) => a.id > b.id ? a : b).id : 0
        const newFilter = {
            id: findMaxId+1,
            filter_name,
            filter_type,
            size_type,
            chart_type,
            influenceTop,
            influenceDown,
            confusion,
            optimalPoint,
            images,
            result,
            userData,
            filterValues,
            HV_images
        }
        this.filters.push(newFilter)
        // await WriteFiltersFile()
        return this.filters
    }

    async update(id: any, newData: any) {
        const oldFilters = [...this.filters]
        const findIndex = oldFilters.findIndex(ele => ele.id === id)
        const spliceFilters = oldFilters.splice(findIndex, 1)
        const newFilter = {
            ...spliceFilters[0],
            ...newData,
        }
        oldFilters.splice(findIndex, 0, newFilter)
        this.filters = oldFilters
        // await WriteFiltersFile()
    }

    async patch(id: any, value: any) {
        const oldFilters = [...this.filters]
        const findIndex = oldFilters.findIndex(ele => ele.id === id)
        oldFilters.splice(findIndex, 1)
        oldFilters.splice(findIndex, 0, {id, ...value})
        this.filters = oldFilters
        // await WriteFiltersFile()
        return oldFilters
    }

    async deleteById(id: any) {
        const newFilters = this.filters.filter(ele => ele.id !== id)
        this.filters = newFilters
        // await WriteFiltersFile()
        return this.filters
    }

    getById(id: number) {
        return this.filters.find((filter: any) => filter.id === id)
    }

    getAll() {
        return this.filters
    }
    
    reset() {
        this.filters = []
        return this.filters
    }
}

const FILTERS = new FiltersSingleton()

export default FILTERS;
