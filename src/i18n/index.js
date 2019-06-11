import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'

//  Setup vue-i18n

let jsLanguage = (navigator.language || navigator.browserLanguage).toLowerCase()
let defaultLanguage = jsLanguage
if (jsLanguage.indexOf('-') > 0) {
  defaultLanguage = jsLanguage.substr(0, jsLanguage.indexOf('-'))
}
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: defaultLanguage,
  messages: {
    'zh': require('./lang/zh-CN').default,
    'en': require('./lang/en').default,
    'ja': require('./lang/Ja').default
  }
})

//  Setup ElementUI With i18n
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
