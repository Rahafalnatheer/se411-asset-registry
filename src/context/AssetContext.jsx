import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { initialAssets } from '../data/assets.js'

const AssetContext = createContext(null)

export function AssetProvider({ children, initial = initialAssets }) {
  const [assets, setAssets] = useState(initial)
  const nextId = useRef(Math.max(0, ...initial.map((a) => a.id)) + 1)

  const addAsset = useCallback((data) => {
    const asset = { ...data, id: nextId.current++ }
    setAssets((prev) => [...prev, asset])
    return asset
  }, [])

  const updateAsset = useCallback((id, changes) => {
    setAssets((prev) => prev.map((a) => (a.id === Number(id) ? { ...a, ...changes, id: a.id } : a)))
  }, [])

  const deleteAsset = useCallback((id) => {
    setAssets((prev) => prev.filter((a) => a.id !== Number(id)))
  }, [])

  const getAsset = useCallback((id) => assets.find((a) => a.id === Number(id)), [assets])

  const value = useMemo(
    () => ({ assets, addAsset, updateAsset, deleteAsset, getAsset }),
    [assets, addAsset, updateAsset, deleteAsset, getAsset],
  )

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export function useAssets() {
  const ctx = useContext(AssetContext)
  if (!ctx) throw new Error('useAssets must be used inside <AssetProvider>')
  return ctx
}
