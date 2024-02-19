export default async function() {
  const buildFn = this.getBuilderFn()
  const { webpackCustom = {} } = this.getConfigs()
  this.console('开始build...')
  buildFn({ env: 'production' }, webpackCustom)
}