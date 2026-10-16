import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAssets } from '../context/AssetContext.jsx'
import { ASSET_STATUSES } from '../data/assets.js'

const money = (n) => Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function AssetList() {
  const { assets, deleteAsset } = useAssets()
  const location = useLocation()
  const notice = location.state?.notice
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return assets.filter((a) => {
      const matchesStatus = status === 'All' || a.status === status
      const matchesText = !q || [a.assetTag, a.name, a.brand, a.assignedTo, a.type].join(' ').toLowerCase().includes(q)
      return matchesStatus && matchesText
    })
  }, [assets, query, status])

  const totalValue = visible.reduce((sum, a) => sum + Number(a.price), 0)

  function handleDelete(asset) {
    if (window.confirm(`Delete ${asset.assetTag} (${asset.name})? This cannot be undone.`)) {
      deleteAsset(asset.id)
    }
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Computers</h1>
          <p className="muted">
            {visible.length} of {assets.length} shown · total value {money(totalValue)}
          </p>
        </div>
        <Link className="btn primary" to="/add">
          Add computer
        </Link>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      <div className="filters">
        <label>
          Search
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tag, model, brand, user" />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {ASSET_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="empty">No computers match. Clear the filters or add a new computer.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tag</th>
                <th>Model</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Assigned to</th>
                <th>Purchased</th>
                <th>Status</th>
                <th className="num">Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id}>
                  <td className="tag">{a.assetTag}</td>
                  <td>{a.name}</td>
                  <td>{a.type}</td>
                  <td>{a.brand}</td>
                  <td>{a.assignedTo || '—'}</td>
                  <td>{a.purchaseDate}</td>
                  <td>
                    <span className={`badge s-${a.status.replace(/\s/g, '').toLowerCase()}`}>{a.status}</span>
                  </td>
                  <td className="num">{money(a.price)}</td>
                  <td className="actions">
                    <Link to={`/edit/${a.id}`} aria-label={`Edit ${a.assetTag}`}>Edit</Link>
                    <button type="button" className="link danger" onClick={() => handleDelete(a)} aria-label={`Delete ${a.assetTag}`}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
