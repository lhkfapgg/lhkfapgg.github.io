export default $


const F = {
  '$': meth,
  '@': at,
  '~': local,
  '/': req, '.': req,
  '\n': xos, '<': xos,
  ' ': delay,
  'default': over,
}
const AT = {}
const LOCAL = new Proxy({}, {
  get(t, k) {
    if (!k) return LOCAL

    return t[k] ??= JSON.parse(localStorage.getItem(k) || null)
  },
  set(t, k, v) {
    if (!k) {
      for (const [key, val] of Object.entries(v)) LOCAL[key] = val
      return true
    }

    LOCAL[k]
    localStorage.setItem(k, JSON.stringify($.call(t)(k)(v)) ?? null)
    return true
  }
})
const XM = new Map()
const SM = new Map()
const OPS = new WeakSet()
const EPS = new WeakSet()
const _O = Symbol('o')
const _E = Symbol('e')

$.call = (t) => (...ar) => $.apply(t, ar)
$._O = _O
$._E = _E

// 主函数 $
function $(k, ...ar) {
  if (T(k) === 'array') k = raw_(k, ...ar)
  const t = this
  const { [k[0]]: f = F.default } = F

  return (v, get) => T(v) === 'promise' ?
    v.then(v => f(t, k, v, get)) :
    f(t, k, v, get)
}

// 主函数 xos
function xos(t, x, o) {
  return (s, ...ar) => {
    if (T(s) === 'array') s = raw_(s, ...ar)
    if (x) o['<>'] ??= x
    if (s) o['#'] ??= s

    const tt = T(t)
    if (tt === 'element') el(t, '', o)
    else if (tt === 'string') el(document.querySelector(t), '', o)

    return o
  }
}

// 迭代 ``
function over(t, k, v, get) {
  if (!t) return
  // get
  if (get || v === undefined || T(t[k]) === 'function') {
    let val = !k ? t : T(k) === 'function' ? k : t[k]
    if (val instanceof Function) val = val(t)
    if (val instanceof Function) val = val(proper({
      get o() { return t },
      get re() { return $.call(t) },
      get '@'() { return AT },
      get '~'() { return LOCAL },
    }, v))
    return val
  }
  // set
  else {
    if (k) {
      // 后缀
      const [m, k_, x] = /(.*?)([\^_-]*)$/.exec(k)
      let _x = x
      if (_x) { k = k_ }
      const val = t[k]
      if (val === v) return val
      if (_x === '_' && val !== undefined) return val

      const [tval, tv] = [T(val), T(v)]
      switch (tval) {
        case 'array': {
          if (tv === 'object') _x = 'o'
          switch (_x) {
            default:
            case '':
              val.push(...v)
              break
            case '^':
              val.unshift(...v)
              break
            case '-':
              t[k] = v
              break
            case '__':
              for (const a of v) if (!val.includes(a)) val.push(a)
              break
            case '^__':
              for (const a of v) if (!val.includes(a)) val.unshift(a)
              break
            case '--':
              for (const a of v) {
                const i = val.indexOf(a)
                if (i !== -1) val.splice(i, 1)
              }
              break
            case 'o':
              Object.entries(v).map(([i, o]) => v[i] = o)
              break
          }
          // 渲染
          const _o = val[_O]
          if (_o?.es?.size) {
            _o.type = { _x, v }
            for (const e of _o.es) {
              el(e, '', val)

              // 更新事件
              const index = e[_E]?.index
              if (index) $.call(t)(index)({ e })
            }
            _o.type = null
          }
          return val
        }
        case 'object': if (_x !== '-') return over(val, '', v)
        default: return t[k] = v
      }
    }
    else if (T(v) === 'array') {
      return v.map(([t, k = '', v, get] = []) => $.call(t)(k)(v, get))
    }
    else {
      for (const [key, re] of Object.entries(v ?? {})) $.call(t)(key)(re)
      // 渲染
      const _o = t[_O]
      if (!OPS.has(t) && _o?.es?.size) {
        OPS.add(t)
        new Promise(res => res()).then(() => {
          for (const e of _o.es) el(e, '', t)
          OPS.delete(t)
        })
      }

      return t
    }
  }
}

// 延时 ` `
async function delay(t, k, v) {
  await new Promise(res => setTimeout(res, k))
  if (t) return $.call(t)('')(v)

  return v
}

// 方法 `$`
function meth(t, k, v) {
  if (!t || k === '$') return

  const re = over(t, k, v, 'get')
  if (re !== undefined) $.call(t)('')(re)
}

// 全局 `@`
function at(t, k, v, get) {
  const k_ = k.slice(1)
  if (!t) return $.call(AT)(k_)(v, get)

  const val = AT[k_]
  if (T(val) === 'function') return $.call(t)(val)(v, get)
  return val
}

// 本地 `~`
function local(t, k, v, get) {
  const k_ = k.slice(1)
  if (v === undefined || get) return LOCAL[k_]

  LOCAL[k_] = v
  return LOCAL[k_]
}

// 请求 `/` `.`
async function req(t, k, v, get) {
  return t && !get ?
    $.call(t)('')(fetch_(k, v)) :
    fetch_(k, v)
}

// 属性
async function attr(e, o) {
  const _e = e[_E]
  _e.attrO = o

  for (const attr_ of _e.attrA) {
    const { kind, name, value } = attr_
    switch (kind) {
      case 'value': {
        const v = value && await $.call(o)(value)({ e }, 'get')
        if (T(v) === 'boolean') e.toggleAttribute(name, v)
        else e.setAttribute(name, v ?? '')
        continue
      }
      case 'input': {
        e[attr_.p] = o[value] ?? value
        continue
      }
      case 'slot': {
        if (typeof value === 'string') {
          _e.slot = $.call(o)(value)({ e }, 'get')
          continue
        }

        const re = {}
        for (const { name, value } of attr_.value) re[name] = $.call(o)(value)({ e }, 'get')
        over(_e.slot, '', re)
        continue
      }
      case 'class': {
        const [str, classA] = attr_.value
        e.className = str + (str && ' ') + Array.from(classA, ({ kind, name, value }) => {
          switch (kind) {
            case 'value': return value
            case 'or': return $.call(o)(value)({ e }, 'get') ? name : ''
            case 'name': return $.call(o)(name)({ e }, 'get')
          }
        }).join(' ')
        continue
      }
      case 'ele': {
        const v = value && await $.call(o)(value)({ e }, 'get');
        e[name] = v ?? value
        continue
      }
    }
  }
}

//元素
async function el(e, k, o) {
  const _e = e[_E] ??= {}

  if (k) {
    const v = await $.call(o)(k)({
      e,
      slot: _e.slot,
    }, 'get')
    if (v === undefined || v === _e.old) return

    el(e, '', v)

    // 更新事件
    if (_e.index) {
      $.call(o)(_e.index)({ e })
    }
    // 初始事件
    if (_e.init) {
      $.call(o)(_e.init)({ e })
      delete _e.init
    }

    return
  }
  else {
    if (o === undefined) return

    if ('!' in _e) {
      if (T(o) === 'string') e.innerHTML = _e.old = o
      return
    }

    // 渲染类型
    switch (T(o)) {
      default:
        e.textContent = _e.old = o
        return
      case 'object': {
        if (_e.old !== o) {
          // 单绑定
          _e.old?.[_O]?.es.delete(e)

          // 缓存
          if ('-' in _e) {
            const max = +(_e['-'] || -1)
            if (!max) ClearE(e)
            if (o['<>'] !== undefined && _e.old !== undefined) {
              const m = _e.m ??= max < 0 ? new WeakMap() : new Map()
              const olda = m.get(_e.old)
              const a = m.get(o)

              if (!olda && max !== 0) {
                m.set(_e.old, [...e.childNodes])
                if (max > 0 && m.size > max) {
                  let n = m;
                  ([[n]] = n).delete(n)
                }
              }

              if (a) {
                const fr = new DocumentFragment()
                fr.append(...a)
                e.textContent = ''
                e.append(fr)

                o?.[_O]?.es.add(e)
                _e.old = o
                _e.ed = true
                return
              }
            }
            _e.old = o
            _e.ed = false
          }
          // 迭代
          else {
            o = await Old(_e.old, o)
            _e.old ??= o
          }
        }

        const _o = o[_O] ??= { es: new Set() }
        _o.es.add(e)

        // 模板
        if (!_e.ed && o['<>'] !== undefined) {
          _e.ed = true
          e.replaceChildren(Fxml(o['<>']))

          // 样式
          if (o['#'] !== undefined) e.append(Fstyle(o['#']))
        }

        // 递归子元素
        if (!EPS.has(e)) {
          EPS.add(e)
          Child(e, o)
          EPS.delete(e)
        }

        return
      }
      case 'array': {
        if (_e.old !== o) {
          // 单绑定
          _e.old?.[_O]?.es.delete(e)
          _e.old = o
        }

        const _o = o[_O] ??= { es: new Set() }
        _o.es.add(e)

        const { _x, v } = _o.type ?? {}
        switch (_x) {
          case '': return e.append(...Farr(v, e))
          case '^': return e.prepend(...Farr(v, e))
          case '--': return Farr(v, e).forEach(c => c.remove())
          case 'o': {
            const m = Object.entries(v)
            const newcs = m.map(([, o]) => Farr([o], e)[0])

            return m.map(([i]) => {
              const oldc = Farr([o[i]], e)[0]
              let cm
              oldc?.parentElement?.replaceChild(cm = document.createComment(i), oldc)

              return cm
            })
              .forEach((cm, n) => cm?.parentElement?.replaceChild(newcs[n], cm))
          }
          case '-':
          default: return e.replaceChildren(...Farr(o, e))
        }
      }
    }
  }
}

// ------
// 类型
function T(o) {
  if (typeof o !== 'object') return typeof o
  if (o === null) return 'null'
  if (o instanceof Array) return 'array'
  if (o instanceof Set) return 'set'
  if (o instanceof Promise) return 'promise'
  if (o instanceof Element) return 'element'
  return 'object'
}

// 标签模板
function raw_(raw, ...ar) {
  return String.raw({ raw }, ...ar)
}

// fetch
async function fetch_(k, v) {
  const url = k === '/' ? v.url : k
  const cof = k === '/' ? v : { body: v }
  const res = await fetch(url, {
    method: cof.body === undefined ? 'GET' : 'POST',
    ...cof,
    headers: {
      'Content-Type': 'application/json',
      ...cof.headers
    },
    body: JSON.stringify(cof.body ?? undefined),
  }).catch(err => null)
  if (!res) return null

  const ctype = res.headers.get('Content-Type')
  switch (ctype) {
    case 'application/json': return res.json()
    default: return res.text()
  }
}

// 模板
function Fxml(s) {
  const x = XM.get(s)
  if (x) return CloneE(x)

  const p = document.createElement('div')
  const fr = new DocumentFragment()
  const s_ = s.replace(/\s*<([/]?)([^\s</>]*)([^<]*?)([/]?)>\s*/sg, (m, p1, p2, p3, p4) => {
    const p2_ = p2.replace(/[^\w-]/g, '')
    const k = ['input', 'hr', 'br'].includes(p2) ? '' : ` ::="${p2}"`
    const p3_ = p3.replace(/\s+([^\s="']+)(\s*[=]\s*["'](.*?)["'])?/g, (m, name, p2, value) => {
      if (value) return ` ${name}="${value}"`

      switch (name[0]) {
        case ':': return ` :="${name.slice(1)}"`
        case '$': return ` ${name}="${name}"`
        default: return ` ${name}`
      }
    }).replace(/\s+$/, '')
    const p4_ = !p4 ? '' : `</${p2_ || 'div'}>`

    return p1 ? `</${p2_ || 'div'}>` : `<${p2_ || 'div'}${k}${p3_}${p2_ ? '' : ` :="${p2}"`}>${p4_}`
  }).replace(/<[/](input|hr|br)>/g, '')

  p.innerHTML = s_
  fr.append(...p.childNodes)
  fr[_E] = {}
  FattrInit(fr)
  XM.set(s, fr)

  // console.log(s_);
  return CloneE(fr)
}

// 样式
function Fstyle(str) {
  const s = SM.get(str)
  if (s) return s.cloneNode(true)

  const e = document.createElement('style')
  e.innerHTML = `@scope{${str}}`

  SM.set(str, e)
  return e
}

// 递归子元素
async function Child(e, o) {
  for (const c of e.children) {
    const _e = c[_E]
    if (!_e) continue

    // 属性
    await attr(c, o)

    // 自身
    const k = _e.k
    if (k === undefined || ('_' in _e && _e.old !== undefined)) continue
    if (!k) Child(c, o)
    else el(c, k, o)
  }
}

// 迭代
async function Old(ol, o) {
  const _o = await o
  if (ol === o || !(_o instanceof Object)) return o
  if (!(ol instanceof Object)) return Old(o, { ...o })

  for (const [k, v] of Object.entries(_o)) {
    const [m, k_, _x] = /^(.+?)([_-]*)$/.exec(k)
    if (T(ol[k_]) === 'function') continue

    switch (_x) {
      default: ol[k_] = await Old(ol[k_], v)
        break
      case '_': ol[k_] ??= await v
        break
      case '-': ol[k_] = await v
        break
    }
  }
  return ol
}

// proper
function proper(o, b) {
  return Object.defineProperties(o, Object.getOwnPropertyDescriptors(b))
}

// 委派
function Fhandle(name, event) {
  if (!name) name = 'name'
  const handle = {
    name,
    get value() { return cache.fv() },
    get valueList() { return cache.fvl() },
    get valueO() { return cache.fvo() },
    get valueE() { return cache.fve() },
    get o() { return cache.fo() },
    get e() { return cache.fe() }
  }
  const ct = event.currentTarget
  const cache = {
    v: undefined,
    vl: undefined,
    ve: undefined,
    vo: undefined,
    o: undefined,
    e: undefined,
    fv(e = event.target) {
      if (cache.v !== undefined) return cache.v

      const s = e.getAttribute(name)
      if (e !== ct && s === null) return cache.fv(e.parentElement)

      cache.ve = e
      return cache.v = s
    },
    fvl() {
      if (cache.vl !== undefined) return cache.vl

      if (cache.v === undefined) cache.fv()
      if (cache.o === undefined) cache.fo()
      const l = cache.v?.split(/\s+/).filter(Boolean) || []

      return Array.from(l, s => {
        const [m, s_] = /^[{](.+)[}]$/.exec(s) || []
        return m ?
          $.call(cache.o)(s_)({ e: cache.e, event, handle }, 'get') :
          s
      })
    },
    fvo() {
      if (cache.vo !== undefined) return cache.vo

      cache.fv()
      return cache.vo = cache.ve?.[_E]?.old
    },
    fve() {
      if (cache.ve !== undefined) return cache.ve

      cache.fv()
      return cache.ve
    },
    fo() {
      if (cache.o !== undefined) return cache.o

      cache.fe()
      return cache.o
    },
    fe(e = cache.ve) {
      if (cache.e !== undefined) return cache.e

      if (e === undefined) {
        cache.fv()
        e = cache.ve
      }

      const o = e[_E]?.old
      if (!o || e === cache.ve && e !== ct) return cache.fe(e.parentElement)

      cache.o = o
      return cache.e = e
    },
  }

  return handle
}

// 数组片段
function Farr(o, e) {
  const _e = e[_E] ??= {}

  _e.childM ??= new WeakMap()
  _e.first ??= e.firstElementChild ?? document.createElement('div')
  _e.first.removeAttribute('::')

  return Array.from(o, li => {
    let c = _e.childM.get(li)
    if (!c) {
      c = CloneE(_e.first)
      if (li instanceof Object) _e.childM.set(li, c)
      el(c, '', li)
    }

    return c
  })
}

// slot
function Fslot(e) {
  const _e = e[_E]
  const value = e.getAttribute('slot')

  // < slot={k} />
  if (value) {
    const [m, v_] = /^[{}](.+)[}]$/.exec(value) || []
    if (m) return { kind: 'slot', value: v_ }

    _e.slot = value === '!' ? e.innerHTML : value
    return
  }
  // < slot>txt</>
  if (!e.firstElementChild) {
    _e.slot = e.innerHTML
    return
  }
  // < slot> <txt :k /> </>
  const slot = _e.slot = { '<>': '' }
  const slotA = Array.from(e.children, c => {
    const k = c.getAttribute('::')
    const v = c.getAttribute(':')

    if (v) {
      slot['<>'] += `<${k}/>`
      return { name: k, value: v }
    }

    slot['<>'] += `<${k} !/>`
    slot[k] = c.innerHTML
    return

  }).filter(Boolean)

  if (slotA.length) return { kind: 'slot', value: slotA }
}

// class
function Fclass(e, classList) {
  let str = ''
  const classA = Array.from([...classList], c => {
    if (!c.includes('{')) {
      str = str + (str && ' ') + c
      return
    }

    const [m, is, n, k] = /((.+)[:])?[{](.+)[}]/.exec(c) || []
    if (!m) return

    classList.remove(c)
    return is ?
      { kind: 'or', name: n, value: k } :
      { kind: 'name', name: k }
  }).filter(Boolean)

  if (classA.length) return { kind: 'class', value: [str, classA] }
}

// attr初始化
function FattrInit(p) {
  for (const e of p.children) {
    const _e = e[_E] = { attrInit: [] }
    const [k, kk, a] = [':', '::', '@'].map(name => e.getAttribute(name))

    // class slot
    let class_
    let slot_
    let { classList } = e
    let slot = e.getAttribute('slot')

    // : ::
    if (k !== null) _e.k = k
    else if (a !== null) {
      _e.k = `@${kk}`
      slot ??= ''
    }
    else if (kk !== null) _e.k = e instanceof HTMLUnknownElement ? kk : ''

    // class slot
    if (slot !== null) {
      slot_ = Fslot(e)
      e.replaceChildren()
    }
    if (classList !== null) {
      class_ = Fclass(e, classList)
    }

    for (const name of ['handle', 'init', 'index', '!', '_', '-']) if (e.hasAttribute(name)) _e[name] = e.getAttribute(name)
    for (const name of [':', '::', '@', '~', 'slot', 'handle', 'init', 'index', '!', '_', '-']) e.removeAttribute(name)

    _e.attrA = Array.from([...e.attributes], ({ name, value }) => {
      e.removeAttribute(name)

      const attrReg = /^([$].+)$|^([{](.+)[}])$|^([:](.+))|$/
      const [m, isMeth, isValue, k, isEle, ek] = attrReg.exec(value)

      if (isMeth) {
        const [n0] = name
        if (n0 === '$') name = e.tagName === 'INPUT' && !['button', 'image', 'submit', 'reset'].includes(e.type) || ['TEXTAREA', 'SELECT'].includes(e.tagName) ?
          'change' :
          'click'
        const [m, v_1, v_2] = /^[$][:][{](.+)[}]$|^[$][:](.+)$/.exec(value) || []

        if (!m) {
          _e.attrInit.push({ kind: 'void', name, value })

          return
        }

        const attr_ = {
          name, value: v_1 || v_2, kind: 'input',
          p: ['checkbox', 'radio'].includes(e.type) ?
            'checked' :
            'value'
        }
        _e.attrInit.push({ kind: 'input', name, value: v_1 || v_2, p: attr_.p, r: v_1 })

        return attr_
      }

      if (isValue) {
        return { name, value: k, kind: 'value' }
      }

      if (isEle) {
        const [m, ek_] = /^[{](.+)[}]$/.exec(ek) || []
        if (m) return { name, value: ek_, kind: 'ele' }

        _e.attrInit.push({ kind: 'ele', name, value: ek })
        return
      }

      return e.setAttribute(name, value)
    }).filter(Boolean)

    if (class_) _e.attrA.push(class_)
    if (slot_) _e.attrA.push(slot_)

    FattrInit(e)
  }
}

// 克隆
function CloneE(ele) {
  const _ele = ele[_E]

  if (_ele) {
    const e = ele.cloneNode(false)
    const _e = e[_E] = { ..._ele, old: undefined, ed: false }

    // attr初始化
    for (const { kind, name, value, p, r } of _e.attrInit || []) switch (kind) {
      case 'void':
        e.addEventListener(name, (event) => {
          meth(_e.attrO, value, {
            e, event,
            get handle() { return Fhandle(_e.handle, event) }
          })
        })
        continue
      case 'input':
        e.addEventListener(name, r ?
          () => over(_e.attrO, '', { [value]: e[p] }) :
          () => over(_e.attrO, value, e[p])
        )
        continue
      case 'ele':
        e[name] = value
        continue
    }

    if ('slot' in _ele) _e.slot = _ele?.slot instanceof Object ? { ..._ele?.slot } : _ele?.slot
    else e.append(...Array.from(ele.childNodes, CloneE))

    return e
  }

  return ele.cloneNode(true)
}

// 清除dom绑定
function ClearE(ele) {
  ele?.[_E]?.old?.[_O]?.es.delete(ele)
  return Array.from(ele.children, ClearE)
}
