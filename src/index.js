import $ from '../public/tree.js'
import Block from './Block.js'
import Tool from './Tool.js'
import Hand from './Hand.js'
import Chunk from './Chunk.js'

export default $`@index`($/*html*/`
  <tool></tool>
  <hand></hand>
  <chunk></chunk>
`({
  tool: Tool(),
  hand: Hand({ size: 10 }),
  chunk: Chunk({ height: 11, width: 11 }),
})/*css*/`

`)
