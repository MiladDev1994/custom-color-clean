const {camelize} = require("./strUtilities");
// import camelize from "./camelize"


const removeZeroPad = (x: any) => {
  if (typeof(x) === "string" && x.startsWith("0") && x.length > 1) {
    let arr = x.split(".");
    if(arr[1] && arr[0].length > 1) x = arr[0].slice(1) + "." + arr[1]
  }
  return x.toString();
}



export const prepareFilterForGettingResult = (filter: any) => {
  // console.log(filter)
  let filterToCheck: any = {};
  switch (true) {
    case filter?.type === "size":
      filterToCheck = {
        size: [{

          isActive: filter.isActive,
          influence: filter.effectiveness,
          priority: filter.viewIndex,
        }]
      }
      Object.values(filter.attributes).forEach((attr: any) => {
        filterToCheck.size[0][camelize(attr.name.replace(/\s/g,''))] = {
          isActive: attr.isActive,
          max_value: attr.max_value,
          min_value: attr.min_value
        };
      });
      return filterToCheck;
    case filter?.type === "line" && filter?.chartKey !== undefined:
      let verticalLines, p1, p2, IsTopSelected, IsGoodSelected;
        if (
          filter.data &&
          filter.data.verticalLines &&
          (filter.data.horizontalLine || filter.data.extendedLines)
        ) {
          verticalLines = filter.data.horizontalLine
            ? filter.data.verticalLines
            : [...filter.data.verticalLines].sort((a, b) => {
                var a: any = Math.abs(a - filter.data.extendedLines[0].x);
                var b: any = Math.abs(b - filter.data.extendedLines[0].x);

                return a < b ? -1 : a > b ? 1 : 0;
              });
          p1 = {
            x: verticalLines[0],
            y:
              filter.data.horizontalLine ??
              filter.data.extendedLines[0].y,
          };
          p2 = {
            x: verticalLines[1],
            y:
              filter.data.horizontalLine ??
              filter.data.extendedLines[1].y,
          };
          p1.x = removeZeroPad(p1.x)
          p1.y = removeZeroPad(p1.y)
          p2.x = removeZeroPad(p2.x)
          p2.y = removeZeroPad(p2.y)
          // console.log("savasvasvas, filter.goodDirection", filter.goodDirection);
          IsTopSelected = filter.goodDirection !== 1;
          IsGoodSelected = filter.isGoodSelected;
        } else {
          verticalLines = [0, 255];
          p1 = {
            x: 0,
            y: 0,
          };
          p2 = {
            x: 255,
            y: 0,
          };
          IsTopSelected = true;
          IsGoodSelected = true;
        }    
        filterToCheck = {
          [filter.chartKey.toLowerCase()]: [
            {
              p1: p1,
              p2: p2,
              isTopSelected: IsTopSelected,
              isGoodSelected: IsGoodSelected,
              isActive: filter.isActive,
              influence: filter.effectiveness,
              priority: filter.viewIndex,
            },
          ],
        };
        return filterToCheck;
    case filter?.type === "scatter" && filter?.chartKey: 
      // console.log("scatter plot");
      return filterToCheck;
    default:
      return filterToCheck;
  }
}



// exports.prepareFilterForGettingResult = prepareFilterForGettingResult;



export const prepareFiltersForGettingResult = (filters: any) => {
  let filtersToCheck: any = {};
  filters.forEach((filter: any) => {
    let temp = prepareFilterForGettingResult(filter);
    Object.keys(temp).forEach(key => {
      if(!filtersToCheck[key]) filtersToCheck[key] = [];
      filtersToCheck[key].push(...temp[key])
    });
  });
  return filtersToCheck;
}





// برای تغییر ساختار اطلاعات مربوط به فایل config
export const convertConfigObj = async (config: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tempConfig: any = {
        attributes: {},
        configs: {}
      };
      await Object.keys(config?.opencv_storage ?? {}).forEach(key => {
        let item = config?.opencv_storage[key];
        switch (true) {
          case key.startsWith("attribute_"):
            if(item.hidden?._text !== "1" && !item?.name?._text.includes("Total") && !item?.name?._text.includes("OK")) {
              tempConfig.attributes[key] = {
                name: item.name._text.replace(/\"/g, ""),
                isActive: item.active._text === "1",
                iconName: item.imgPath._text.replace(".svg", "").replace(/\"/g, ""),
              }
              Object.keys(item).forEach(innerKey => {
                switch (innerKey) {
                  case "force":
                    tempConfig.attributes[key]["force"] = item.force._text.replace(/\"/g, "").split(",").map((i: any) =>  Number.parseInt(i));
                    break;
      
                  case "hardParam":
                  case "max_value":
                  case "min_value":
                    tempConfig.attributes[key][innerKey] = Number.parseInt(item[innerKey]._text);
                    break;
                  
                  default:
                    break;
                }
              });
            }
            break;
          case key === "active":
              tempConfig.isActive = Number.parseInt(item._text) === 1;
            break;
          case key === "p1":
          case key === "p2":
            if(!tempConfig.data) tempConfig.data = {};
            tempConfig.data[key] = {};
            tempConfig.data[key].x = item.x._text;
            tempConfig.data[key].y = item.y._text;
            break;
          case !key.startsWith("filter_") && key !== "_comment":
            if(item._text) tempConfig.configs[key] = item._text.replace(/\"/g, "")
            else console.log(key, item);
            break;
          default:
            break;
        }
      });
      resolve(tempConfig);
    } catch (error) {
      reject(error);
    }
    
  })
 
}


export const prepareConfigsAndFilters = async (config: any, filters: any) => {
  return new Promise(async (resolve, reject)  => { 
    try {
      let sorterConfig;
      let tempfilters: any = {};
      await convertConfigObj(config).then(async conf => {
        sorterConfig = conf
        await Object.keys(filters).forEach(async key => {
          await convertConfigObj(filters[key]).then((res: any) => {
            if(filters?.[key]?.opencv_storage?.filterType?._text) {
              let fType = filters[key].opencv_storage.filterType._text.replace(
                /\"/g, "").toLowerCase();

              switch (fType) {
                case "deep learning":
                case "size":
                  let fTypeKey = fType.startsWith("deep") ? "deep" : "size";
                  tempfilters[fTypeKey] = {},
                  tempfilters[fTypeKey] = res;
                  break;
                case "line": 
                //TODO
                  tempfilters[res.configs.name]= res
                  break;
                default:
                  break;
              }
            }
            });
          });
        resolve([sorterConfig, tempfilters]);
      });
    } catch (error) {
      reject(error);
    }
  });
  
}








export const clampingChartValues = (value: any) => {
  let res = value;
  if(value > 300) res = 300;
  if(value < -300 ) res = -300;
  return res;
}
