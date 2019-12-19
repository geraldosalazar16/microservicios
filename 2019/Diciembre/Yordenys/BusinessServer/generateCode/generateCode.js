module.exports.getNextCode = function(unique_name) {
    return unique_name + String(Math.random() * 100);
}

module.exports.getNextId = function() {
    var date = new Date()
    return String(date.getFullYear()) + String(date.getMonth()) + String(date.getDay()) + String(date.getHours()) + String(date.getSeconds()) + String(date.getMilliseconds())
}