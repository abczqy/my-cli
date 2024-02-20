// const fs = require("fs");
// const path = require("path");
// const execSync = require("child_process").execSync;

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

class Utils {
  /**
   * 获取某个包的安装情况
   * 返回 0 表示未安装 1 表示安装并非最新 2 表示安装最新
   */
  getInstalledStatus(pkgName, targetDir) {
    const genObj = this.getInstalledPkgs(targetDir);
    if (!genObj[pkgName]) return 0;
    const lts = execSync(`npm view ${pkgName} version --registry=https://registry.npmmirror.com --json`) // buffer 转 string
    const current = this.requireFrom(targetDir, path.join(pkgName, "package.json")).version + '';
    if (current === lts.trim()) return 2;
    return 1;
  }

  /**
   * 获取路径下已经安装的 generator 包
   */
  getInstalledGenerators(targetDir) {
    const dependencies = this.getInstalledPkgs(targetDir);
    Object.keys(dependencies).forEach(v => {
      if (!v.match(/^zqyan-/)) delete dependencies[v];
    });
    return dependencies;
  }

  /**
   * 获取路径下已经安装的包
   */
  getInstalledPkgs(targetDir) {
    const pkgJsonFile = path.resolve(targetDir, "package.json");
    if (!fs.existsSync(pkgJsonFile)) return {};
    const pkgJson = fs.readFileSync(pkgJsonFile, 'utf-8');
    const pkg = JSON.parse(pkgJson)
    return pkg.dependencies || {};
  }

  /**
   * 获取 build 方法
   */
  getBuilderFn() {
    const { builder } = this.getConfigs();
    const status = this.getInstalledStatus(builder, process.cwd());
    switch (status) {
      case 0:
        this.console(
          `检测到工程并未添加${builder}，将自动为您安装最新版`,
          "red"
        );
        this.console(`安装${builder}中...`);
        execSync(
          `npm i ${builder}@latest -S --registry=https://registry.npmmirror.com`,
          { cwd: process.cwd() }
        );
        break;
      case 1:
        this.console(
          `检测到您的${builder}并非最新版，推荐在工程下 npm i ${builder}@latest -S 进行更新`
        );
        break;
      default:
    }
    return this.requireFrom(process.cwd(), builder);
  }

  getConfigs() {
    const configs = this.requireFrom(process.cwd(), "./build.js");
    if (!configs || !configs.builder) {
      this.console(
        "请确保工程根路径下有 build.js 文件，且文件中配置了 builder 属性",
        "red"
      );
      process.exit(1);
    }
    return configs;
  }
}

// module.exports = Utils;
export default Utils