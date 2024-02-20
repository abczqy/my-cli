// const install = require('./install')
import install from './install.js'

export default async function() {
  const genObj = this.getInstalledGenerators(this.dir.tpl)
  if (!Object.keys(genObj).length) {
    this.console(`您还没有安装任何 generator，请先执行 install 命令安装`)
    return
  }
  const { tpl: pkgName } = await this.inquirer.prompt({ message: '请选择一个模板：', type: 'list', name: 'tpl', choices: Object.keys(genObj) })
  const status = this.getInstalledStatus(pkgName, this.dir.tpl)
  if (status !== 2) {
    const { needUpdate } = await this.inquirer.prompt({ message: '有最新模板是否更新：', type: 'list', name: 'needUpdate', choices: ['是', '否'] })
    if (needUpdate === '是') await install.call(this, pkgName)
  }
  // const path = this.resolveFrom(this.dir.tpl, `node_modules/${pkgName}`)
  this.yoemanEnv.register(`${this.dir.tpl}/node_modules/${pkgName}`, pkgName)
  this.yoemanEnv.run(pkgName, this.args).then(() => {
    this.console('一切才刚刚开始...', 'green')
  })
}