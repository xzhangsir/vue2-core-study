import Module from './module'

class ModuleCollection {
  constructor(options) {
    this.register([], options)
  }

  register(path, rootModule) {
    let newModule = new Module(rootModule)
    if (path.length === 0) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo._children(current)
      }, this.root)
      parent._children[path[path.length - 1]] = newModule
    }
    // console.log(rootModule)
    if (rootModule.modules) {
      Object.keys(rootModule.modules).forEach((moduleName) => {
        let module = rootModule.modules[moduleName]
        this.register(path.concat(moduleName), module)
      })
    }
  }

  getNamespaced(path) {
    console.log(path)
    let root = this.root
    return path.reduce((str, key) => {
      // console.log(root, key)
      root = root.getChild(key)
      return str + (root._raw.namespaced ? key + '/' : '')
    }, '')
  }
}
export default ModuleCollection
