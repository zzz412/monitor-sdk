/**
 * 约定git提交规范
 * types:[空格]message
 * e.g. feat: 这是一个新的feature
 */

const types = [
  'feat', // 新功能 feature
  'fix', // 修复 bug
  'docs', // 文档注释
  'style', // 代码格式(不影响代码运行的变动)
  'refactor', // 重构(既不增加新功能，也不是修复bug)
  'perf', // 性能优化
  'test', // 增加测试
  'chore', // 构建过程或辅助工具的变动
  'revert', // 回退
  'build' // 打包
]

const commitTypeRules = [
  2, 'always', types
]

module.exports = { 
  extends: ['@commitlint/config-conventional'],
  rules: {
    "type-enum": commitTypeRules
  }
};