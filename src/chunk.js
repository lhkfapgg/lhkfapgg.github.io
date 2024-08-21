import $ from '../public/tree.js'
import Block from "./Block.js"

export default () => $`
  <blocks $Hchunk handle="submit">
    <block></block>
  </blocks>
`({
  $Hchunk: ({ }) => ({ }) => {

  }
})()