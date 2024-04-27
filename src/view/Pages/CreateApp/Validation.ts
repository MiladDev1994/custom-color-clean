export function CreateAppFormValidation(values: any) {
    const error: any = {}

    if (!values?.app_name.trim()) {
        error.app_name = "نام برنامه را وارد کنید"
    } else if (values.app_name.trim().length < 5) {
        error.app_name = "باید بیشتر از 4 کاراکتر باشد"
    } else {
        delete error.app_name
    }


    if (!values?.filter_name.trim()) {
        error.filter_name = "نام فیلتر را وارد کنید"
    } else if (values.filter_name.trim().length < 5) {
        error.filter_name = "باید بیشتر از 4 کاراکتر باشد"
    } else {
        delete error.filter_name
    }

    
    if (!values?.healthy?.trim()) {
        error.healthy = "آدرس را انتخاب کنید"
    } else {
        delete error.healthy
    }


    if (!values?.not_healthy?.trim()) {
        error.not_healthy = "آدرس را انتخاب کنید"
    } else {
        delete error.not_healthy
    }

    
    if (!values?.filter_type.trim()) {
        error.filter_type = "نوع فیلتر را انتخاب کنید"
    } else {
        delete error.filter_type
    }

    
    if (values.filter_type !== "SCATTER") {
        if (values.app_type === null) {
            error.app_type = "نوع برنامه را انتخاب کنید"
        } else {
            delete error.app_type
        }
        if (!values.product_type) {
            error.product_type = "نوع محصول را انتخاب کنید"
        } else {
            delete error.product_type
        }
    } else {
        delete error.product_type
        delete error.app_type
    }



    return error
}