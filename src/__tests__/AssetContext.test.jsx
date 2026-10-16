import { renderHook, act } from '@testing-library/react'
import { AssetProvider, useAssets } from '../context/AssetContext.jsx'

const seed = [
  { id: 1, assetTag: 'PC-1', name: 'Alpha', type: 'Laptop', brand: 'Dell', assignedTo: '', purchaseDate: '2024-01-01', status: 'In use', price: 100 },
  { id: 2, assetTag: 'PC-2', name: 'Beta', type: 'Desktop', brand: 'HP', assignedTo: '', purchaseDate: '2024-02-02', status: 'In stock', price: 200 },
]
const setup = () => renderHook(() => useAssets(), { wrapper: ({ children }) => <AssetProvider initial={seed}>{children}</AssetProvider> })

describe('AssetContext', () => {
  it('starts with the initial assets', () => {
    expect(setup().result.current.assets).toHaveLength(2)
  })

  it('addAsset appends an asset with a new unique id', () => {
    const { result } = setup()
    act(() => { result.current.addAsset({ ...seed[0], assetTag: 'PC-3', name: 'Gamma' }) })
    expect(result.current.assets).toHaveLength(3)
    expect(result.current.assets[2]).toMatchObject({ id: 3, name: 'Gamma' })
  })

  it('updateAsset changes only the targeted asset', () => {
    const { result } = setup()
    act(() => { result.current.updateAsset(1, { name: 'Alpha v2' }) })
    expect(result.current.getAsset(1).name).toBe('Alpha v2')
    expect(result.current.getAsset(2).name).toBe('Beta')
  })

  it('deleteAsset removes the asset', () => {
    const { result } = setup()
    act(() => { result.current.deleteAsset(1) })
    expect(result.current.assets.map((a) => a.id)).toEqual([2])
    expect(result.current.getAsset(1)).toBeUndefined()
  })

  it('getAsset accepts a string id (as read from the URL)', () => {
    expect(setup().result.current.getAsset('2').name).toBe('Beta')
  })
})
