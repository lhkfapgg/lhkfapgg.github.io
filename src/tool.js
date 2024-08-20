import $ from '../public/tree.js'
import { Fblock, Fitem } from './f/index.js';

export default () => ['-tool-0'].map((id) => Fblock({ item: TOOL_ITEMS.get(id) }))

const TOOL_ITEMS = new Map([
  ['-tool-0', {
    name: '开始',
    classList: '-tool-start',
    txt: '开始',
    block: {
      submit: 'start',
    }
  }]
])
