# RestQA Plugin Bootstrap

> A bootstrap module to get build a RestQA plugin.

### Description

[RestQA](https://github.com/restqa/restqa) is a runner composed of different plugins such as:

* [RestqAPI](https://github.com/restqa/restqapi) : adding Restful API steps into the RestQA runner
* etc...

In order to get a comon plugin fundation this repository should support the important module required.


### If you don't plan to build a RestQA Module, this library is not for you.

# Usage

As you know RestQA is based on Gherkin language, if you want to create a new plugin you need first to understand how to use [CucumberJS](https://github.com/cucumber/cucumber-js).

This project will gives you a small booster to create a new plugin by providing a **Worl** object that you can extend and a data management.

Example: 

```js
const { World } = require('@restqa/restqa-plugin-boostrap')


class YourModuleWorld extends World {
  setup () {
    this.myList = this []
  }
}

module.exports = YourModuleWorld
```

