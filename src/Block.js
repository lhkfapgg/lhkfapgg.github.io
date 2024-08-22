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

// 通用属性
const COMMON = {
  block: {
    '<>': `<item -></item>`
  },
  item: {
    '<>': `
      <show class={id} choose={choose} submit={submit}></show>
      <info></info>
    `,
    choose: false,
    submit: false,
    $toget: ({ }) => ({ from, to }) => {
      if (from.item.id !== '-item-null') return

      [from.item, to.item] = [to.item, from.item]
      from.n++
    },
    $get: ({ }) => ({ from, to }) => {
      if (from.item.id !== to.item.id) return

      to.item = Block({ id: '-item-null' }).item
      from.n++
    },
  }
}

// 全物品
const ITEMS = new Map([
  [
    '-item-null',
    () => ({
      info: '空',
      $get: null,
      $toget: null,
      $toset: ({ }) => ({ from, to }) => {
        if (from.item.id === '-item-null') return

        to.item = from.item
        from.n--
        if (from.n > 0) return

        from.item = Block({ id: '-item-null' }).item
        from.n = 0
      },
    })
  ], [
    '-item-water',
    () => ({
      info: '水',
    })
  ], [
    '-item-soil',
    () => ({
      info: '土',
    })
  ], [
    '-item-glass',
    () => ({
      info: '草',
    })
  ], [
    '-item-stone',
    () => ({
      info: '石',
    })
  ], [
    '-item-sand',
    () => ({
      info: '沙',
    })
  ],

])

// 方块函数
Object.assign(Block, {
  get: (id) => ITEMS.get(id),
  set: (id, f) => ITEMS.set(id, f),
  sets: (a) => a.map(([id, f]) => Block.set(id, f)),
  size: () => ITEMS.size,
  ids: () => Array.from(ITEMS, ([id]) => id)
})
