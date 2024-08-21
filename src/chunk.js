import $ from '../public/tree.js'
import Block from "./Block.js"

export default ({ height, width } = {}) => $`
  <box $Hchunk handle="submit">
    <blocks>
      <block submit="block"></block>
    </blocks>
  </box>
`({
  height,
  width,
  box: Fbox({ height, width }),
  $init: ({ height: h, width: w }) => ({ height = h, width = w }) => ({
    'box-': Fbox({ height, width })
  }),
  $Hchunk: ({ }) => ({ handle: { valueO, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        console.log(valueO);

    }
  },
})()

// 生成盒子
function Fbox({ height = 19, width = 19 }) {
  const ids = Block.ids().filter(id => /^-item-/.test(id))
  const size = Block.size()
  const arr = [...Array(height)]
    .map((_, i) => [...Array(width)]
      .map((_, j) => {
        return Block({ id: ids[R(ids.length)] })
      })
    )

  return arr
}

// 生成随机整数
function R(n) {
  return Math.floor(Math.random() * n)
}
