import formatMoney from '../lib/formatMoney'

describe('checking fn format money', ()=>{
  it('cents work', ()=>{
    expect(formatMoney(1)).toEqual('$0.01')
  })
})