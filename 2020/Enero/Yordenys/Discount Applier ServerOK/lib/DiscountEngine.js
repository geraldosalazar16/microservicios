//This Class provides methods of DiscountEngine to perform condition validations.


//checking variation 
exports.checking_variation = (variation, errorlist) => {
    //object error
    var error = { title: "faild checking variation", message: "", item: null }

    //checking field of the variation object 
    if (variation['type'] && variation['amount'] && Object.keys(variation).length == 2) {

        //checking type of the variation object 
        if (typeof(variation['type']) === 'string') {
            if (variation['type'] != 'fixed' && variation['type'] != 'percent') {
                error.message = error.message + " One of fixed or percent values "
            }
        } else
            error.message = error.message + " type is a string "
        if (typeof(variation['amount']) != 'number')
            error.message = error.message + " amount is a number "
    } else
        error.message = error.message + " object variation fields are not defined correctly "

    //error out
    if (error.message != "") {
        error.item = variation
        errorlist.push(error)
        return false
    }
    return true
}

//checking list condition
exports.checking_condition = (condition, error) => {
    //object error
    var error = { title: "faild checking condition", message: "", item: null }

    //checking field of the condition object 
    if (condition['type'] && condition['params'] && Object.keys(condition).length == 2) {

        //checking type of the condition object 
        if (typeof(condition['type']) != 'string')
            error.message = error.message + " type is a string "

        if (typeof(condition['params']) != 'object')
            error.message = error.message + " params is a object "
    } else
        error.message = error.message + " object condition fields are not defined correctly "

    //error out
    if (error.message != "") {
        error.item = condition
        error.push(error)
        return false
    }
    return true
}

//checking list conditions 
exports.checking_conditions = (conditions, ObjectError) => {
    list_conditions = []
    conditions.forEach(element => {
        //get conditions
        if (exports.checking_condition(element, ObjectError)) {
            list_conditions.push(element)
        }
    });
    return list_conditions
}

// parser variation and conditions
exports.parser = (variation, conditions) => {

    var error = 'errol in the '
    var ObjectError = []
    var variation_object = null

    //Checks the format of the  conditions.
    var list_Conditions = exports.checking_conditions(conditions, ObjectError)
    if (ObjectError.length != 0) {
        error = ' format conditions'
    }

    //Checks the format of the variation 
    var isError_Checking_variation = exports.checking_variation(variation, ObjectError)
    if (!isError_Checking_variation) {
        error = error + ' format variation'
    }

    // out errol
    if (!isError_Checking_variation || list_Conditions.length == 0)
        return {
            title: "faild",
            message: error,
            item: ObjectError
        }
    else
    // out result  success
        return {
        title: "success ",
        message: "",
        list_Conditions
    }

    //Leave the body of this method empty
}

exports.validate = (conditions, payload) => {
    //Checks the conditions.
    var error = []
    exports.checking_conditions(conditions, error)
    if (error.length != 0) {
        return {
            title: "failed",
            message: error,
            item: conditions
        }
    }
    return {
        title: "success",
        message: "",
        item: null
    }

    //Leave the body of this method empty
}

exports.apply = (price, variation) => {
    //Checks the variation.
    if (!exports.checking_variation(variation)) {
        return {
            title: "failed",
            message: error,
            item: variation
        }
    }
    //return out 
    return variation.type === "percent" ? price * variation.amount : price + variation.amount
}