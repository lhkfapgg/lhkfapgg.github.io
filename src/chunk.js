import $ from '../public/tree.js'
import { Fblock, Fitem } from "./f/index.js";

export default ({ size: [height = 19, width = 19] = [] } = {}) => {
  const chunk = [...Array(width)]
    .map(() => [...Array(height)]
      .map(() => Fblock({ item: Fitem({id: '-0'}) }))
    )

  return chunk
}
