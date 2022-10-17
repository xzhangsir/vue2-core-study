/**
 * Module 模块类，提供模块数据结构与相关能力扩展
 */
class Module {
  constructor(newModule) {
    this._raw = newModule
    this._children = {}
    this.state = newModule.state
  }
  /**
   * 根据模块名获取模块实例
   * @param {*} key 模块名
   * @returns 模块实例
   */
  getChild(key) {
    return this._children[key]
  }
  /**
   * 向当前模块实例添加子模块
   * @param {*} key     模块名
   * @param {*} module  子模块实例
   */
  addChild(key, module) {
    this._children[key] = module
  }

  /**
   * 遍历当前模块下的 mutations,具体处理由外部回调实现
   * @param {*} fn 返回当前 mutation 和 key,具体处理逻辑由调用方实现
   */
  forEachMutation(fn) {
    if (this._raw.mutations) {
      Object.keys(this._raw.mutations).forEach((key) =>
        fn(this._raw.mutations[key], key)
      )
    }
  }
  /**
   * 遍历当前模块下的 actions,具体处理由外部回调实现
   * @param {*} fn 返回当前 action 和 key,具体处理逻辑由调用方实现
   */
  forEachAction(fn) {
    if (this._raw.actions) {
      Object.keys(this._raw.actions).forEach((key) =>
        fn(this._raw.actions[key], key)
      )
    }
  }
  /**
   * 遍历当前模块下的 getters,具体处理由外部回调实现
   * @param {*} fn 返回当前 getter 和 key,具体处理逻辑由调用方实现
   */
  forEachGetter(fn) {
    if (this._raw.getters) {
      Object.keys(this._raw.getters).forEach((key) =>
        fn(this._raw.getters[key], key)
      )
    }
  }
  /**
   * 遍历当前模块的子模块,具体处理由外部回调实现
   * @param {*} fn 返回当前子模块 和 key,具体处理逻辑由调用方实现
   */
  forEachChild(fn) {
    Object.keys(this._children).forEach((key) => fn(this._children[key], key))
  }
}

export default Module
