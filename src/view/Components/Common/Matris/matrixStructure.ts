
const MatrixTheme = {
    success: "bg-emerald-300 text-emerald-900 border-2 border-emerald-500 hover:bg-emerald-400",
    success_dashed: "bg-emerald-300 text-emerald-900 border-2 border-dashed border-emerald-500 hover:bg-emerald-400",
    danger: "bg-red-300 text-red-900 border-2 border-red-500 hover:bg-red-400",
    danger_dashed: "bg-red-300 text-red-900 border-2 border-dashed border-red-500 hover:bg-red-400",
    sum: "bg-zinc-200 text-zinc-900 border-2 border-zinc-400 hover:bg-zinc-300",
    sumAccuracy: "bg-zinc-500 text-zinc-100 border-2 border-zinc-700 hover:bg-zinc-600",
}

const calculateTheme = {
    success: "bg-emerald-300 ring-emerald-500 text-gray-700",
    success_dashed: "bg-emerald-300 ring-emerald-500 text-gray-700",
    danger: "bg-red-300 ring-red-500 text-gray-700",
    danger_dashed: "bg-red-300 ring-red-500 text-gray-700",
    sum: "bg-zinc-200 ring-zinc-400 text-gray-700",
    sumAccuracy: "bg-zinc-500 ring-zinc-700 text-gray-100",
}

export const Structure = [
    {
        type: "e4", 
        nickname: "LabelPositive", 
        description: "سرنوشت بار خوب", 
        style: MatrixTheme.sum, 
        icon_style: "sum",
        countKey: "n4",
        calculate: {
            numerator: "تعداد خوب‌ها در خروجی مقبول",
            denominator: "تعداد کل بار خوب",
            style: calculateTheme.sum,
        }
    },
    {
        type: "e1", 
        nickname: "FN", 
        description: "بار خوب در خروجی ردشده", 
        style: MatrixTheme.danger_dashed, 
        icon_style: "danger_dashed",
        countKey: "n1",
        calculate: {
            numerator: "تعداد خوب‌ها در خروجی رد شده",
            denominator: "تعداد کل بار",
            style: calculateTheme.danger_dashed,
        }
    },
    {
        type: "e0", 
        nickname: "TP", 
        description: "بار خوب در خروجی مقبول",
        style: MatrixTheme.success, 
        icon_style: "success",
        countKey: "n0",
        calculate: {
            numerator: "تعداد خوب‌ها در خروجی مقبول",
            denominator: "تعداد کل بار",
            style: calculateTheme.success,
        }
    },
    {
        type: "e5", 
        nickname: "LabelNegative", 
        description: "سرنوشت بار بد", 
        style: MatrixTheme.sum, 
        icon_style: "sum",
        countKey: "n5",
        calculate: {
            numerator: "تعداد بد‌ها در خروجی رد شده",
            denominator: "تعداد کل بار بد",
            style: calculateTheme.sum,
        }
    },
    {
        type: "e3", 
        nickname: "TN", 
        description: "بار بد در خروجی ردشده", 
        style: MatrixTheme.success_dashed, 
        icon_style: "success_dashed",
        countKey: "n3",
        calculate: {
            numerator: "تعداد بار بد در خروجی رد شده",
            denominator: "تعداد کل بار",
            style: calculateTheme.success_dashed,
        }
    },
    {
        type: "e2", 
        nickname: "FP", 
        description: "بار بد در خروجی مقبول", 
        style: MatrixTheme.danger, 
        icon_style: "danger",
        countKey: "n2",
        calculate: {
            numerator: "تعداد بدها در خروجی مقبول",
            denominator: "تعداد کل بار",
            style: calculateTheme.danger,
        }
    },
    {
        type: "e8", 
        nickname: "Accuracy", 
        description: "دقت کلی", 
        style: MatrixTheme.sumAccuracy, 
        icon_style: "sumAccuracy",
        countKey: "n8",
        calculate: {
            numerator: "تعداد درست‌ها در خروجی مقبول + تعداد بدها در خروجی رد شده",
            denominator: "تعداد کل بار",
            style: calculateTheme.sumAccuracy,
        }
    },
    {
        type: "e7", 
        nickname: "PredictionNegative", 
        description: "دقت خروجی ردشده", 
        style: MatrixTheme.sum, 
        icon_style: "sum",
        countKey: "n7",
        calculate: {
            numerator: "تعداد بد‌ها",
            denominator: "تعداد کل خروجی رد شده",
            style: calculateTheme.sum,
        }
    },
    {
        type: "e6", 
        nickname: "PredictionPositive", 
        description: "دقت خروجی مقبول", 
        style: MatrixTheme.sum, 
        icon_style: "sum",
        countKey: "n6",
        calculate: {
            numerator: "تعداد خوب‌ها",
            denominator: "تعداد کل خروجی مقبول",
            style: calculateTheme.sum,
        }
    },
]






// const MatrixTheme = {
//     success: "bg-emerald-300 text-emerald-900 border border-emerald-500 hover:bg-emerald-400",
//     success_dashed: "bg-emerald-300 text-emerald-900 border border-dashed border-emerald-500 hover:bg-emerald-400",
//     danger: "bg-red-300 text-red-900 border border-red-500 hover:bg-red-400",
//     danger_dashed: "bg-red-300 text-red-900 border border-dashed border-red-500 hover:bg-red-400",
//     sum: "bg-zinc-200 text-zinc-900 border border-zinc-400 hover:bg-zinc-300",
//     sumAccuracy: "bg-zinc-500 text-zinc-100 border border-zinc-700 hover:bg-zinc-600",
// }
// export const Structure = [
//     {
//         type: "111",
//         description: "empty",
//         style: "row-span-1 col-span-2"
//     },
//     {
//         type: "222",
//         description: "خروجی رد شده",
//         style: "row-span-1 col-span-2"
//     },
//     {
//         type: "333",
//         description: "خروجی مقبول ",
//         style: "row-span-1 col-span-2"
//     },
//     {
//         type: "333",
//         description: "empty",
//         style: "row-span-1 col-span-1"
//     },
//     {
//         type: "e4", 
//         nickname: "LabelPositive", 
//         description: "سرنوشت بار خوب", 
//         style: MatrixTheme.sum + " col-span-2 row-span-3", 
//         icon_style: "sum",
//         countKey: "n4",
//         calculate: {
//             numerator: "تعداد خوب‌ها در خروجی مقبول",
//             denominator: "تعداد کل بار خوب",
//         }
//     },
//     {
//         type: "e1", 
//         nickname: "FN", 
//         description: "بار خوب در خروجی رد شده", 
//         style: MatrixTheme.danger_dashed + " col-span-2 row-span-3", 
//         icon_style: "danger_dashed",
//         countKey: "n1",
//         calculate: {
//             numerator: "تعداد خوب‌ها در خروجی رد شده",
//             denominator: "تعداد کل بار",
//         }
//     },
//     {
//         type: "e0", 
//         nickname: "TP", 
//         description: "بار خوب در خروجی مقبول",
//         style: MatrixTheme.success + " col-span-2 row-span-3", 
//         icon_style: "success",
//         countKey: "n0",
//         calculate: {
//             numerator: "تعداد خوب‌ها در خروجی مقبول",
//             denominator: "تعداد کل بار",
//         }
//     },
//     {
//         type: "4444",
//         description: "بار خوب",
//         style: "row-span-3 col-span-1"
//     },
//     {
//         type: "e5", 
//         nickname: "LabelNegative", 
//         description: "سرنوشت بار بد", 
//         style: MatrixTheme.sum + " col-span-2 row-span-3", 
//         icon_style: "sum",
//         countKey: "n5",
//         calculate: {
//             numerator: "تعداد بد‌ها در خروجی رد شده",
//             denominator: "تعداد کل بار بد",
//         }
//     },
//     {
//         type: "e3", 
//         nickname: "TN", 
//         description: "بار بد در خروجی رد شده", 
//         style: MatrixTheme.success_dashed + " col-span-2 row-span-3", 
//         icon_style: "success_dashed",
//         countKey: "n3",
//         calculate: {
//             numerator: "تعداد بار بد در خروجی رد شده",
//             denominator: "تعداد کل بار",
//         }
//     },
//     {
//         type: "e2", 
//         nickname: "FP", 
//         description: "بار بد در خروجی مقبول", 
//         style: MatrixTheme.danger + " col-span-2 row-span-3", 
//         icon_style: "danger",
//         countKey: "n2",
//         calculate: {
//             numerator: "تعداد بدها در خروجی مقبول",
//             denominator: "تعداد کل بار",
//         }
//     },
//     {
//         type: "4444",
//         description: "بار بد",
//         style: "row-span-3 col-span-1"
//     },
//     {
//         type: "e8", 
//         nickname: "Accuracy", 
//         description: "دقت کلی", 
//         style: MatrixTheme.sumAccuracy + " col-span-2 row-span-3", 
//         icon_style: "sumAccuracy",
//         countKey: "n8",
//         calculate: {
//             numerator: "تعداد درست‌ها در خروجی مقبول + تعداد بده‌ها در خروجی رد شده",
//             denominator: "تعداد کل بار",
//         }
//     },
//     {
//         type: "e7", 
//         nickname: "PredictionNegative", 
//         description: "دقت خروجی رد شده", 
//         style: MatrixTheme.sum + " col-span-2 row-span-3", 
//         icon_style: "sum",
//         countKey: "n7",
//         calculate: {
//             numerator: "تعداد بد‌ها",
//             denominator: "تعداد کل خروجی رد شده",
//         }
//     },
//     {
//         type: "e6", 
//         nickname: "PredictionPositive", 
//         description: "دقت خروجی مقبول", 
//         style: MatrixTheme.sum + " col-span-2 row-span-3", 
//         icon_style: "sum",
//         countKey: "n6",
//         calculate: {
//             numerator: "تعداد خوب‌ها",
//             denominator: "تعداد کل خروجی مقبول",
//         }
//     },
//     {
//         type: "555",
//         description: "empty",
//         style: "row-span-3 col-span-1"
//     },
// ]