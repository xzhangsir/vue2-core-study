import { isObject } from '../utils';
import { track, trigger } from './effect';

export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      //收集依赖
      track(target, key);
      return res;
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver);
      //更新依赖
      trigger(target, key);
      return res;
    },
  });

  return proxy;
}
