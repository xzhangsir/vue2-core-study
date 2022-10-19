export default  {
  name: 'routerView',
  render(){
    return <div>{this.$route.path}</div>
  }
}