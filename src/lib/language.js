let jsLanguage = (navigator.language || navigator.browserLanguage).toLowerCase()
// let defaultLanguage = jsLanguage
// if (jsLanguage.indexOf('-') > 0) {
//   defaultLanguage = jsLanguage.substr(0, jsLanguage.indexOf('-'))
// }
export default {defaultLanguage: jsLanguage}
