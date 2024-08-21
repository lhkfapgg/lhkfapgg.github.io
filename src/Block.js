import $ from '../public/tree.js'

export default function Block({ id, item, ...ar } = {}) {
  const item_ = id ? Block.get(id)?.({ id, item, ...ar }) : null

  return {
    item: {
      id,
      ...COMMON.item,
      ...item_,
      ...item,
    },
    ...COMMON.block,
    ...ar,
  }
}

const COMMON = {
  block: {
    '<>': `<item></item>`
  },
  item: {
    '<>': `<show class={id} submit={submit}></show>`,
    submit: false
  }
}

const ITEMS = new Map([
  ['-0', () => ({

  })]
])

Block.get = (id) => ITEMS.get(id)
Block.set = (id, f) => ITEMS.set(id, f)
Block.sets = (a) => a.map(([id, f]) => Block.set(id, f))
