export default {
    props: {
      to: String
    },
    render() {
      return <a href={this.to}>{this.$slots.default}</a>
    }
}