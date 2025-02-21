import pages from "./pages/index.js"

export default $`
  <r $h handle='submit'>
    <block>
      <txt submit='{name}'></txt>
    </block>
  </r>
  <page - class='{key}'></page>
`({
  pages,
  key: $`~page`() || 'simple',
  r: pages.map(({ name, txt }) => ({
    name,
    txt,
  })),
  page: ({ pages, key }) => pages.find(p => p.name === key).page,
  $h: ({ }) => ({ handle: { valueList: [key] } }) => ({
    key: $`~page`(key)
  })
})``
