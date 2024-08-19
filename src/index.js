import $ from '../public/tree.js'


// 一般物品属性
const COM_ITEM={
  // 环境
  around: ({id, weight: wt})=>({[id]: ({weight})=> weight + wt}),
  // 单击
  toget: ({num, item: {id}={}})=>({to, to: {item: {id: tid}={}}})=>{
    if(id===tid){
      $.call(to)``({'item-': Fitem({})})
      return {num: num+1}
    }
  },
  // 右击
  toset: ({num, item})=>({to})=>{
    if(to.item.id!==0)return

    $.call(to)``({'item-': item})
    
    return num-1<1 ? 
      {num: 0, 'item-': Fitem({})} :
      {num: num-1}
  },
  get: ({})=>({}),
  set: ({})=>({})
}

// 全物品
const ITEMS=[
  {
    id: 0,
    name: '空',
    classList: 'null',
    weight: 0,
    around: null,
    toget: ({choose})=>({to, to: {item}})=>{
      if(!choose||!item||item.id===0)return
      
      $.call(to)``({'item-': Fitem({})})
      return {'item-': item, num: 1}
    },
    toset: null
  },{
    id: 1,
    name: '水',
    classList: 'water',
    weight: 1,
    around: ({})=>({
      0:({w})=> 0,
      1:({w})=> w*2+4,
      2:({w})=> 0,
      3:({w})=> 0,
      4:({w})=> w+2,
      5:({w})=> 0,
      6:({w})=> 0,
    }),
    init: ({})=>({entry})=>R(19)===0 && entry(1, 0),
  },{
    id: 2,
    name: '草',
    classList: 'glass',
    weight: 5,
    around: ({})=>({
      2:({w})=> w*2,
      3:({w})=> 1,
    }),
  },{
    id: 3,
    name: '花',
    classList: 'flower',
    weight: 0,
    around: ({})=>({
      2:({w})=> w+2,
      3:({w})=> w+9,
    }),
  },{
    id: 4,
    name: '沙',
    classList: 'sand',
    weight: 1,
    around: ({})=>({
      4: ({w})=> w+2,
    }),
  },{
    id: 5,
    name: '土',
    classList: 'soil',
    weight: 2,
    around: ({})=>({
      5:({w})=> w+4,
    }),
  },{
    id: 6,
    name: '石',
    classList: 'stone',
    weight: 2,
    around: ({})=>({
      0: ({w})=> w+0.5,
      6: ({w})=> w*2+2,
    }),
  },
]

// 一般实体属性
const COM_ENTRY={
  run: {
    3: ({})=>({move})=>move([1, 20, -18][WR({weights: [10, 1, 1]})])
  }
}

// 全实体
const ENTRIES=[
  {
    id: '-e-0',
    name: '云',
    classList: 'cloud',
    weight: 1,
  },{
    id: '-e-1',
    name: '鱼',
    classList: 'fish',
    weight: 0,
  },
]

// 物品总重
const ITEMS_WEIGHTS=ITEMS.map(o=>o.weight)

// 实体总重
const ENTRIES_WEIGHTS=ENTRIES.map(o=>o.weight)

// 加权随机函数
const WR = ({weights, arounds=[]})=>{
  const weights_=[...weights]
  for(const a of shuffle({list: arounds})){
    for(const [i, f] of Object.entries(a)) weights_[i]=f({w: weights_[i]})
  }
  const total=weights_.reduce((a,b)=>a+b)
  let r=Math.random()*total
  let i=0
  for(const w of weights_){
    r-=w
    if(r<0) return i
    i++
  }
}

// 随机函数
const R = (n)=>Math.floor(Math.random() * n)

// 乱序函数
const shuffle=({size, list})=>{
  const idxs=list || [...Array(size)].map((u, i)=>i)
  for(let i=idxs.length-1; i>0; i--){
    const j=R(i+1);
    [idxs[i], idxs[j]]=[idxs[j], idxs[i]]
  }

  return idxs
}

// 一般方块属性
const COM_BLOCK={
  choose: false,
  num: 0,
  // 显示
  show: ({item, choose, num})=>({
    choose,
    num: num || '',
    ...item,
  }),
  // 代理方法
  $toget: o=>o.item?.toget?.(o),
  $toset: o=>o.item?.toset?.(o),
  $get: o=>o.item?.get?.(o),
  $set: o=>o.item?.set?.(o),
  // 代理行为
  $run: ({})=>({o, o: {parent}, f, hand, chunk})=>{
    const move=(n)=>{
        if(!n)return

        const i=(parent.i+n+361) % 361
        const to=chunk[i]
        $.call(parent)`entries--`([o])
        $.call(to)`entries`([o])
        o.parent=to
    }
    const block=(n)=>{
      if(!n)return parent

      const i=(parent.i+n+361) % 361
      return chunk[i]
    }

    return f(o)?.({o, hand, chunk, move, block})
  },
}

// 方块
const Fblock = ({ item=Fitem({}), ...ar })=>({
  item,
  entries: [],
  ...COM_BLOCK,
  ...ar,
})

// 物品
const Fitem=({n=0})=>{
  return {
    ...COM_ITEM,
    ...ITEMS[n]
  }
}

// 实体
const Fentry=({n=0})=>{
  return {
    ...COM_ENTRY,
    ...ENTRIES[n]
  }
}


// 手持
const Fhand = ({ size=19 })=>[...Array(size)].map((u, i)=>Fblock({i}))

// 区块
const Fchunk = ({size=19*19})=>{
  const arr=[...Array(size)]
  const idxs=shuffle({size})
  const Faround=n=>arr[n]?.item?.around ? $.call(arr[n].item)`around`({}, 'get') : null

  // 生成方块
  for(const i of idxs) arr[i]=Fblock({
    item: Fitem({
      n: WR({
        weights: ITEMS_WEIGHTS,
        arounds: [i-18, i-19, i-20, i-1, i+1, i+18, i+19, i+20]
          .map(Faround)
          .filter(Boolean)
      })
    }),
    i,
  })
  
  // 生成实体
  let n=9
  arr.entryList = new Set()
  while (n--){
    const parent=arr[R(size)]
    const entry= Fblock({
      item: Fentry({
        n: WR({
          weights: ENTRIES_WEIGHTS,
          arounds: []
        })
      }),
      parent
    })
    parent.entries?.push?.(entry)
    arr.entryList.add(entry)
  }
  

  return arr
}

export default $`
< class="nomenu">
  <@bu slot $start>开始</bu>
  <@bu slot $save>存档</bu>
  <@bu slot $load>读档</bu> <hr />

  <hand $Hhand handle="submit" init="$init">
    <block submit="block">
      <show>
        <item class={classList} title={name} choose={choose} />
        <num />
      </show>
    </block>
  </hand>

  <chunk $Hchunk contextmenu="$HchunkMenu" handle="submit">
    <block submit="block">
      <show>
        <item class={classList} title={name} choose={choose} />
      </show>

      <entries>
        <block>
          <show>
            <item class={classList} title={name} choose={choose} />
          </show>
        </block>
      </entries>
    </block>
  </chunk>
</>
`({
  
  hand: Fhand({size: 16}),
  chunk: Fchunk({}),

  $init: ({})=>({e, o})=>{
    // 阻止默认右击
    e.parentElement.addEventListener('contextmenu', (event)=>event.preventDefault())
    // 实体行动
    setInterval(()=>{
      for(const b of o.chunk.entryList){
        for(const [t, f] of Object.entries(b.item?.run)){
          if(R(t)===0) $.call(b)`$run`({f, hand: o.hand, chunk: o.chunk})
        }
      }
    }, 1000)
  },
  // 新世界
  $start: ({})=>({'chunk-': Fchunk({})}),
  // 手持（单击）
  $Hhand: ({})=>({handle: {valueO: vo, valueO: {choose}}})=>{
    $.call(vo)``({choose: !choose})
  },
  // 区块（单击）
  $Hchunk: ({hand, chunk})=>({handle: {valueO: to}})=>{
    for(const from of hand){
      if(!from.choose)continue

      $.call(from)`$toget`({to, hand, chunk})
      $.call(to)`$get`({from, hand, chunk})
    }
  },
  // 区块（右击）
  $HchunkMenu: ({hand, chunk})=>({handle: {valueO: to}})=>{
    for(const from of hand){
      if(!from.choose)continue
      
      $.call(from)`$toset`({to, hand, chunk})
      $.call(to)`$set`({from, hand, chunk})
    }
  }

})``



// document.createElement().