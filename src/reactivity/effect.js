const effectStack = []; //栈
let activeEffect;
export function effect(fn, options = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn;
      effectStack.push(activeEffect);
      return fn();
    } finally {
      // activeEffect = null
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  };
  if (!options.lazy) {
    return effectFn();
  }
  effectFn.scheduler = options.scheduler;
  return effectFn;
}
const targetMap = new WeakMap();
export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    //第一次肯定不存在
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    //第一次肯定不存在
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);
}
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    //说明没有被代理上
    return;
  }
  const deps = depsMap.get(key);
  if (!deps) {
    //说明没有被代理上
    return;
  }

  deps.forEach((effectFn) => {
    if (effectFn.scheduler) {
      effectFn.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}
