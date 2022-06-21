import { effect } from './reactivity/effect';
import { reactive } from './reactivity/reactive';

const user = (window.user = reactive({
  name: 'zx',
  age: 12,
}));

// const classes = reactive({
//   name: '学前班',
// });

// effect(() => {
//   console.log(user.name, classes.name);
// });
effect(() => {
  effect(() => {
    console.log('user', user.name);
  });
  console.log(user.age);
});
