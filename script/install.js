// const execSync = require('child_process').execSync
import { execSync } from 'child_process'

export default async function(pkgName) {
  pkgName = pkgName || process.argv[3]
  pkgName = pkgName.match(/^zqyan-/) ? pkgName : `zqyan-${pkgName}`
  const status = this.getInstalledStatus(pkgName, this.dir.tpl)
  if (status === 2) {
    this.console('您已经安装最新版，无需安装')
    return
  }
  this.console(`正在安装最新版的 ${pkgName} ...`)
  try {
    execSync(`npm i ${pkgName}@latest -S`, { cwd: this.dir.tpl })
    this.console(`升级完成`, 'green')
  } catch (e) {
    this.console(`安装失败，请检查包名称是否正确 ${pkgName}`, 'red')
  }
}