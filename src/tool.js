import $ from '../public/tree.js'
import Block from "./Block.js"

export default () => $`
  <blocks $Htool handle="submit">
    <block></block>
  </blocks>
`({
  blocks: ['-tool-0', '-tool-1', '-tool-2'].map(id => Block({ id })),
  $Htool: ({ }) => ({ handle: { o, valueList: [key] } }) => {
    console.log(key, o);


  }
})``

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
])
