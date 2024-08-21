import $ from '../public/tree.js'
import Block from "./Block.js"

export default ({ size = 16 } = {}) => $`
  <blocks $Hchunk handle="submit">
    <block submit="block"></block>
  </blocks>
`({
  blocks: [...Array(size)].map(Block),
  chooseS: new Set(),
  $Hchunk: ({ chooseS }) => ({ handle: { valueO, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        const { item: { choose } } = valueO
        chooseS[choose ? 'delete' : 'add'](valueO)
        $.call(valueO)`item`({ choose: !choose })
    }

  }
})()
