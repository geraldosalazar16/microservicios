exports.parse = async function (checklist) {
    try {
        return true;
    } catch (e) {
        return e.message;
    }
}


exports.authorize = async function (params, rule) {
    try {
        return true;
    } catch (e) {
        return e.message;
    }
}