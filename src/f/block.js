import $ from '../../public/tree.js'

export default ({ item }) => ({
  ...COM_BLOCK,
  item,
  ...item?.block,
})

const COM_BLOCK = {
  '<>': /*html*/`<show submit={submit}></show>`,
  item: {},
  choose: false,
  num: 0,
  show: ({ item: { name, classList, txt }, choose, num }) =>
    $/*html*/`
      <item :txt class={classList} title={name} choose={choose}></item>
      <num></num>
    `({
      name,
      classList,
      txt,
      choose,
      num: num || '',
    })(),
  submit: 'block'
}
