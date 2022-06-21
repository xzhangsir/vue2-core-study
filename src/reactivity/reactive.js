import { hasChanged, isArray, isObject } from '../utils';
import { track, trigger } from './effect';

const proxyMap = new WeakMap();

export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  //如果target 被代理过 直接return出去
  if (isReactive(target)) {
    return target;
  }
  if (proxyMap.has(target)) {
    return proxyMap.get(target);
  }
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__isReactive') {
        return true;
      }
      const res = Reflect.get(target, key, receiver);
      //收集依赖
      track(target, key);
      // return res;
      return isObject(res) ? reactive(res) : res; //深对象代理
    },
    set(target, key, value, receiver) {
      const oldArrayLen = isArray(target) ? target.length : -1;
      const oldVal = Reflect.get(target, key, receiver);
      const res = Reflect.set(target, key, value, receiver);
      if (hasChanged(oldVal, value)) {
        //当旧值不等于新值的时候  更新依赖
        trigger(target, key);
        if (oldArrayLen > -1 && hasChanged(oldArrayLen, target.length)) {
          trigger(target, 'length');
        }
      }

      return res;
    },
  });

  proxyMap.set(target, proxy);

  return proxy;
}

export function isReactive(target) {
  return !!(target && target.__isReactive);
}
