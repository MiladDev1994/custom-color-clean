import { RecoilState, atom, selector } from "recoil";






// const { persistAtom } = recoilPersist();
// export const programNameStateAtom = atom({
//   key: "programNameStateAtom",
//   // default: "test",
//   default: "",
// });

// export const defaultObjectTypeStateAtom = atom({
//   key: "defaultObjectTypeStateAtom",
//   default: -1,
//   // default: 0,
// });

// export const defaultObjectsListStateAtom = atom({
//   key: "defaultObjectsListStateAtom",
//   default: [
//     // {id: -1,label: "نوع محصول", value:-1},
//     {id: 0,label: "بار خوب حذف بار بد", value:0},
//     {id: 1,label: "بار بد استخراج بار خوب", value:1},
//   ],
// });

// export const productTypeStateAtom = atom({
//   key: "productTypeStateAtom",
//   default: -1,
//   // default: 1,
// });

// export const productTypesListStateAtom = atom({
//   key: "productTypesListStateAtom",
//   default: [
//     // {id: -1,label: "نوع محصول", value:"choose"},
//     {id: 0,label: "پسته", value:"pistachio"},
//     {id: 1,label: "بادام زمینی", value:"peanut"},
//     {id: 2,label: "تخمه آفتاب‌گردان", value:"sfs"},
//     {id: 3,label: "ماش", value:"mung"},
//   ],
// });

// export const productTypeValueStateAtom = selector({
//   key: "productTypeValueStateAtom",
//   get: ({get}) => {
//     const productId = get(productTypeStateAtom);
//     const productTypes = get(productTypesListStateAtom);
//     return productTypes.find(pt => pt.id === productId)?.value ?? ""
//   },
// });


// export const goodCommodityDirStateAtom = atom({
//   key: "goodCommodityDirStateAtom",
//   default: "",
//   effects_UNSTABLE: [persistAtom],
//   // default: "D:/offline_pic/250",
//   // default: "E:/sorterOffline/mung/salem",
// });

// export const badCommodityDirStateAtom = atom({
//   key: "badCommodityDirStateAtom",
//   default: "",
//   effects_UNSTABLE: [persistAtom],
//   // default: "D:/offline_pic/khorde",
//   // default: "E:/sorterOffline/mung/sang",
// });

// export const removeBlueBackStateAtom = atom({
//   key: "removeBlueBackStateAtom",
//   default: false,
//   // default: true,
// });

// export const filterTypesListAtom = atom({
//     key: "filterTypesListAtom",
//     default: [
//       {id: 0,label: "فیلتر دیپ لرنینگ", type: "deep"},
//       {id: 1,label: "فیلتر سایز", type: "size"},
//       {id: 2,label: "فیلتر تک بعدی", type: "line"},
//       {id: 3,label: "فیلتر دو بعدی", type: "scatter"},
//     ],
// });

// export const filterTypesListSelector = selector({
//   key: 'filterTypesListSelector',
//   get: ({get}) => {
//     const filters = get(filtersListStateAtom);
//     const filterTypes = get(filterTypesListAtom);

//     let hasDeep = false;
//     filters.forEach(filter => {
//       if(filter.type === "deep") hasDeep = true;
//     });
//     if(hasDeep) return filterTypes.filter(item => item.type !== "deep")
//     return filterTypes
//   },
// });


// export const filtersListStateAtom = atom({
//   key: "filtersListStateAtom",
//   default: [],
// });

// export const lastFiltersListStateAtom = atom({
//   key: "lastFiltersListStateAtom",
//   default: [],
// });

// export const allDatasetsStateAtom = atom({
//   key: "allDatasetsStateAtom",
//   default: {},
// });

// export const datasetKeyStateAtom = atom({
//   key: "datasetKeyStateAtom",
//   default: "Hue",
// });

// export const generalFilterConfigsListAtom = atom({
//   key: "generalFilterParamsListAtom",
//   default: {},
// });

// export const generalFilterConfigsListCopyAtom = atom({
//   key: "generalFilterConfigsListCopyAtom",
//   default: {},
// });

// export const generalFilterConfigsTranslateAtom = atom({
//   key: "generalFilterConfigsTranslateAtom",
//   default: {},
// });

// export const defaultFiltersListAtom = atom({
//   key: "defaultFiltersListAtom",
//   default: {
//   },
// });

// export const isLoadingChartDataStateAtom = atom({
//   key: "isLoadingChartDataStateAtom",
//   default: true,
// });

// export const isLoadingSaveFileStateAtom = atom({
//   key: "isLoadingSaveFileStateAtom",
//   default: false,
// });

// export const isLoadingFilterDataStateAtom = atom({
//   key: "isLoadingFilterDataStateAtom",
//   default: false,
// });

// export const loadingProgressStateAtom = atom({
//   key: "loadingProgressStateAtom",
//   default: 0,
// });

// export const isUpdatingActiveChartResultStateAtom = atom({
//   key: "isUpdatingActiveChartResultStateAtom",
//   default: false,
// });

// export const directoryPathSaveStateAtom = atom({
//   key: "directoryPathSaveStateAtom",
//   default: "",
// });

// export const resultsDataStateAtom = atom({
//   key: "resultsDataStateAtom",
//   default: {},
// });



// filters
export const Filter1DState: RecoilState<any> = atom({
  key: "Filter1DState",
  default: [],
});

export const Filter2DState: RecoilState<any> = atom({
  key: "Filter2DState",
  default: [],
});



export const ProgressState: RecoilState<any> = atom({
  key: "ProgressState",
  default: 100,
});

export const IsModalOpenState: RecoilState<any> = atom({
  key: "IsModalOpenState",
  default: false,
});

export const ModalTypeState: RecoilState<undefined | "NewOrOpen" | "AddFilter"> = atom({
  key: "ModalTypeState",
  default: undefined,
});


export const FilterState: RecoilState<any> = atom({
  key: 'FilterState',
  default: []
});

export const AppDataState: RecoilState<any> = atom({
  key: 'AppDataState',
  default: {}
});










export const WorksState: RecoilState<any> = atom({
  key: 'WorksState',
  default: {},
});

export const FilterActiveIdState: RecoilState<any> = atom({
  key: 'FilterActiveIdState',
  default: 0,
});

export const AllRecordState: RecoilState<any> = atom({
  key: 'AllRecordState',
  default: [],
});

export const ChartDataState: RecoilState<any> = atom({
    key: 'ChartDataState',
    default: {},
});

export const ChartLengthState: RecoilState<any> = atom({
    key: 'ChartLengthState',
    default: 0,
});

export const DirectoryValueState: RecoilState<any> = atom({
    key: 'DirectoryValueState',
    default: "",
});

export const HistsDataState: RecoilState<any> = atom({
  key: 'HistsDataState',
  default: "",
});


export const directoryPathSaveStateAtom: RecoilState<any> = atom({
  key: "directoryPathSaveStateAtom",
  default: "",
});

export const isLoadingSaveFileStateAtom: RecoilState<any> = atom({
  key: "isLoadingSaveFileStateAtom",
  default: false,
});

export const filtersListStateAtom: RecoilState<any> = atom({
  key: "filtersListStateAtom",
  default: [],
});


export const generalFilterConfigsListCopyAtom: RecoilState<any> = atom({
  key: "generalFilterConfigsListCopyAtom",
  default: {},
});

export const programNameStateAtom: RecoilState<any> = atom({
  key: "programNameStateAtom",
  // default: "test",
  default: "",
});

export const generalFilterConfigsListAtom = atom({
  key: "generalFilterParamsListAtom",
  default: {},
});


export const defaultFiltersListAtom = atom({
  key: "defaultFiltersListAtom",
  default: {
  },
});

export const generalFilterConfigsTranslateAtom = atom({
  key: "generalFilterConfigsTranslateAtom",
  default: {},
});

export const defaultObjectTypeStateAtom = atom({
  key: "defaultObjectTypeStateAtom",
  default: -1,
  // default: 0,
});

export const productTypeStateAtom = atom({
  key: "productTypeStateAtom",
  default: -1,
  // default: 1,
});

export const productTypesListStateAtom = atom({
  key: "productTypesListStateAtom",
  default: [
    // {id: -1,label: "نوع محصول", value:"choose"},
    {id: 0,label: "PST-01", value:"pistachio"},
    {id: 1,label: "PNT-01", value:"peanut"},
    {id: 2,label: "SEED-01", value:"sfs"},
    {id: 3,label: "MNG-01", value:"mung"},
  ],
});