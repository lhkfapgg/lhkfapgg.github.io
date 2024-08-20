import $ from '../public/tree.js'
import { Fblock, Fitem } from "./f/index.js";

export default ({ size = 16 } = {}) => [...Array(size)]
  .map(()=>Fblock({ item: Fitem({ id: '-0' }) }))
