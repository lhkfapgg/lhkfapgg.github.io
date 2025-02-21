import Block from "./Block.js"

export default () => $`
  <blocks $Htool handle="submit">
    <block></block>
  </blocks>
`({
  blocks: Fblocks(),
  $Htool: ({ }) => ({ handle: { valueList: [key] } }) => {
    switch (key) {
      case 'start':
        $`@index`({ chunk: { $init: {} } })
        return
      case 'clearhand':
        $`@index`({ hand: { $init: {} } })
        return
    }
  }
})()

// 生成工具栏
function Fblocks() {
  return ['-tool-0', '-tool-1', '-tool-2', '-tool-3']
    .map(id => Block({ id }))
}

Block.sets([
  ['-tool-0', () => ({
    show: '开始',
    submit: 'start'
  })],
  ['-tool-1', () => ({
    show: '存档',
    submit: 'save'
  })],
  ['-tool-2', () => ({
    show: '读档',
    submit: 'load'
  })],
  ['-tool-3', () => ({
    show: '空手',
    submit: 'clearhand'
  })],
])
