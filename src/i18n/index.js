import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import language from '@/lib/language'

//  Setup vue-i18n

// let jsLanguage = (navigator.language || navigator.browserLanguage).toLowerCase()
// let defaultLanguage = jsLanguage
// if (jsLanguage.indexOf('-') > 0) {
//   defaultLanguage = jsLanguage.substr(0, jsLanguage.indexOf('-'))
// }
let defaultLanguage = language.defaultLanguage
const allLanguage = {'zh-cn': 1, 'en': 1, 'ja': 1}
// 如果默认没有语言就选择 en
if (!allLanguage[defaultLanguage]) {
  defaultLanguage = 'en'
}
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: defaultLanguage,
  messages: {
    'zh-cn': require('./lang/zh-cn').default,
    'en': require('./lang/en').default,
    'ja': require('./lang/Ja').default
  }
})

//  Setup ElementUI With i18n
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
