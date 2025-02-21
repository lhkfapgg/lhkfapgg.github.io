import pages from "./pages/index.js"

export default $`
  <r $h handle='submit'>
    <>
      <txt submit='{name}' class='active:{is}'></txt>
    </>
  </r>
  <page - class='{key}'></page>
`({
  pages,
  key: $`~page`() || 'simple',
  r: pages.map(({ name, txt }) => ({
    is: name === ($`~page`() || 'simple'),
    name,
    txt,
  })),
  page: ({ pages, key }) => pages.find(p => p.name === key).page,
  $h: ({ r }) => ({ o, handle: { valueList: [key] } }) => {
    $.call(r.find(p => p.is))``({ is: false })
    $.call(r.find(p => p.name === key))``({ is: true })

    return { key: $`~page`(key) }
  },
})``
