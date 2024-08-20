import $ from '../public/tree.js'
import Ftool from './tool.js'
import Fhand from './hand.js'
import Fchunk from './chunk.js'

export default $/*html*/`
  <tool class="blocks" $Htool handle="submit">
    <block></block>
  </tool>

  <hand class="blocks" $Hhand handle="submit">
    <block></block>
  </hand>

  <chunk class="blocks" $Hchunk handle="submit">
    <>
      <block></block>
    </>
  </chunk>
`({
  tool: Ftool(),
  hand: Fhand(),
  chunk: Fchunk(),

  $Htool: ({ }) => ({ handle: { valueList: [key] } }) => {
    switch (key) {
      case 'start':
        return { 'chunk-': Fchunk() }
    }
  },
  $Hhand: ({ }) => ({ handle: { o, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        $.call(o)``({ choose: !o.choose })
    }
  },
  $Hchunk: ({ }) => ({ handle: { o, valueList: [key] } }) => {
    switch (key) {
      case 'block':
        $.call(o)``({ choose: !o.choose })
    }
  },
})/*css*/`

`
