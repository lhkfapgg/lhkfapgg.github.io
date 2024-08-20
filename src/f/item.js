export default ({ id }) => ({
  ...COM_ITEM,
  ...ITEMS.get(id),
  id,
})

const COM_ITEM = {

}

const ITEMS = new Map([
  ['-0', {
    name: '空',
    classList: 'null'
  }],

])
