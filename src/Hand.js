import $ from '../public/tree.js'
import Block from "./Block.js"

export default ({ size } = {}) => $`
  <blocks class="outline" $Hchunk handle="submit">
    <block submit="block"></block>
  </blocks>
`({
  size,
  blocks: Fblocks({ size }),
  $init: ({ size: s }) => ({ size = s }) => ({
    'blocks-': Fblocks({ size })
  }),
  $Hchunk: ({ }) => ({ handle: { valueO, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        const { choose } = valueO
        $.call(valueO)``({ choose: !choose })
    }
  },
})()

// 生成物品栏
function Fblocks({ size = 16 }) {
  return [...Array(size)].map(() => Block({
    '<>': `
      <item choose={choose}></item>
      <n :nShow></n>
    `,
    choose: false,
    n: 0,
    nShow: ({ n }) => n || ''
  }))
}
