export function AddFilterFormValidation(values: any) {
    const error: any = {}

    
    if (!values?.filter_name.trim()) {
        error.filter_name = "نام فیلتر را وارد کنید"
    } else if (values.filter_name.trim().length < 5 || values.filter_name.trim().length > 15) {
        error.filter_name = "نام فیلتر باید بین 5 تا 15 کاراکتر باشد"
    } else {
        delete error.filter_name
    }

    
    if (!values?.filter_type) {
        error.filter_type = "نوع فیلتر را انتخاب کنید"
    } else {
        delete error.filter_type

        if (values.filter_type === "SIZE") {
            if (values.size_type === "") {
                error.size_type = "نوع نمودار را انتخاب کنید"
            } else {
                delete error.size_type
            }
        }
        if (values.filter_type === "LINE") {
            if (values.chart_type === "") {
                error.chart_type = "نوع نمودار را انتخاب کنید"
            } else {
                delete error.chart_type
            }
        }
    }

    return error;
}