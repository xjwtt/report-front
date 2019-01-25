# report-front

> iretailer report v3.5

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## GIT Config
```bash
git config --global core.autocrlf false
git config --global core.safecrlf true
```


## VS Code Pluging
```
EditorConfig for VS Code
ESLint
Prettier
Vetur
```

## VS Code Config
```javascript
{
"eslint.autoFixOnSave": true, // 每次保存的时候将代码按eslint格式进行修复
"prettier.eslintIntegration": true, //让prettier使用eslint的代码格式进行校验
"prettier.semi": false, //去掉代码结尾的分号
"prettier.singleQuote": true, //使用带引号替代双引号
"javascript.format.insertSpaceBeforeFunctionParenthesis": true, //让函数(名)和后面的括号之间加个空格
"vetur.format.defaultFormatter.html": "js-beautify-html", //格式化.vue中html
"vetur.format.defaultFormatter.js": "vscode-typescript", //让vue中的js按编辑器自带的ts格式进行格式化
"vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
        "wrap_attributes": "force-aligned" //属性强制折行对齐
    }
},
"eslint.validate": [ //开启对.vue文件中错误的检查
    "javascript",
    "javascriptreact",
    {
        "language": "html",
        "autoFix": true
    },
    {
        "language": "vue",
        "autoFix": true
    }
],
"terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```
