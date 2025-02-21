import Block from "./Block.js"

export default ({ size } = {}) => $`
  <blocks class="outline" $Hhand handle="submit">
    <block submit="block"></block>
  </blocks>
`({
  size,
  blocks: Fblocks({ size }),
  $init: ({ size: s }) => ({ size = s }) => ({
    'blocks-': Fblocks({ size })
  }),
  $Hhand: ({ }) => ({ handle: { valueO, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        const { choose } = valueO
        $.call(valueO)``({ choose: !choose })
        return
    }
  },
  $get: ({ blocks }) => ({ re, to, box }) => {
    for (const from of blocks) if (from.choose) {
      $.call(from.item)`$get`({ from, to, box, hand: blocks })
      $.call(from)``({})
      $.call(to.item)`$toget`({ from, to, box, hand: blocks })
      $.call(to)``({})
    }
  },
  $set: ({ blocks }) => ({ re, to, box }) => {
    for (const from of blocks) if (from.choose) {
      $.call(to.item)`$toset`({ from, to, box, hand: blocks })
      $.call(to)``({})
      $.call(from.item)`$set`({ from, to, box, hand: blocks })
      $.call(from)``({})
    }
  },

})()

// 生成物品栏
function Fblocks({ size = 16 }) {
  return [...Array(size)].map(() => Block({
    id: '-item-null',
    '<>': `
      <item choose={choose} -></item>
      <n :nShow></n>
    `,
    choose: false,
    n: 0,
    nShow: ({ n }) => n || ''
  }))
}
