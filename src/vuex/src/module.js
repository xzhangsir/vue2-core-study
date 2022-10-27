class Module {
  constructor(newModule) {
    this._raw = newModule
    this._children = {}
    this.state = newModule.state
  }
  // 根据模块名 获取模块实例
  getChild(key) {
    return this._children[key]
  }
  // 向当前模块实例添加子模块
  addChild(key, module) {
    this._children[key] = module
  }
  forEachMutation(fn) {
    if (this._raw.mutations) {
      Object.keys(this._raw.mutations).forEach((key) => {
        fn(this._raw.mutations[key], key)
      })
    }
  }
  forEachAction(fn) {
    if (this._raw.actions) {
      Object.keys(this._raw.actions).forEach((key) =>
        fn(this._raw.actions[key], key)
      )
    }
  }
  forEachGetter(fn) {
    if (this._raw.getters) {
      Object.keys(this._raw.getters).forEach((key) =>
        fn(this._raw.getters[key], key)
      )
    }
  }
  forEachChild(fn) {
    Object.keys(this._children).forEach((key) => fn(this._children[key], key))
  }
}

export default Module
