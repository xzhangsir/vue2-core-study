export default {
  // 组件名称
  name: 'routerLink',
  props: {
    to: { // 目标路径
      type: String,
      required: true
    },
    tag: {  // 标签名，默认 a
      type: String,
      default: 'a'
    }
  },
  render() {
    // const current = this.$route
    let { tag, to } = this;
    const handler = ()=>{
      console.log(this.$router)
      this.$router.push(to)
    }
    // JSX：标签 + 点击跳转事件 + 插槽
    return <tag onClick={handler}>{this.$slots.default}</tag>
  }
}