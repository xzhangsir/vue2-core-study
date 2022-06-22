import { isFunction } from '../utils';
import { effect, track, trigger } from './effect';

export function computed(getterOrOption) {
  let getter, setter;
  if (isFunction(getterOrOption)) {
    getter = getterOrOption;
    setter = () => {
      console.warn('computed is readonly!');
    };
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }
  return new ComputedImpl(getter, setter);
}

class ComputedImpl {
  constructor(getter, setter) {
    this._setter = setter;
    this._value = undefined;
    //标记下 如果值没有变化 计算属性不执行
    this._dirty = true;
    this.effect = effect(getter, {
      //刚加载不执行
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, 'value');
        }
      },
    });
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect();
      this._dirty = false;
      track(this, 'value');
    }
    return this._value;
  }
  set value(newVal) {
    this._setter(newVal);
  }
}
