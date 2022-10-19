// export default  {
//   name: 'routerView',
//   render(){
//     return <div>{this.$route.path}</div>
//   }
// }
 export default  {
  name: 'routerView',
  functional: true,// 函数式组件
  // 普通组件，使用组件需要先进行实例化再挂载：new Ctor().$mount();
  // 函数式组件，无需创建实例即可直接使用（相当于 react 中的函数组件）;
  // 他们之间唯一的区别就是 render 函数中没有 this，即没有组件状态（没有data，props等）

  render(h,{parent,data}) {
    // console.log(data)
    // console.log("parent",parent)
      // 获取当前需要渲染的相关路由记录，即：this.current
      let route = parent.$route
      // console.log(route)
      let depth = 0;// 记录等级深度
      data.routerView = true; // 自定义属性
      // App.vue渲染组件时，调用render函数，此时的父亲中没有 data.routerView 属性
      // 在渲染第一层时，添加routerView=true标识
      while(parent){// parent 为 router-view 的父标签
      // parent.$vnode：代表占位符的vnode；即：组件标签名的虚拟节点；
      // parent._vnode 指组件的内容；即：实际要渲染的虚拟节点；
        if(parent.$vnode && parent.$vnode.data.routerView){
          depth++
        }
        // 更新父组件，用于循环的下一次处理
        parent = parent.$parent
      }
      // 第一层router-view 渲染第一个record 第二个router-view渲染第二个
      let record = route.matched[0].matched[depth]; // 获取对应层级的记录
      // 未匹配到路由记录，渲染空虚拟节点（empty-vnode），也叫作注释节点
      if (!record) {
        return h();
      }
      return h(record.component, data);
  }
} 