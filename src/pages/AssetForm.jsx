import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAssets } from '../context/AssetContext.jsx'
import { ASSET_STATUSES, ASSET_TYPES } from '../data/assets.js'

const emptyForm = {
  assetTag: '', name: '', type: ASSET_TYPES[0], brand: '',
  assignedTo: '', purchaseDate: '', status: ASSET_STATUSES[1], price: '',
}

function validate(v, assets, editingId) {
  const e = {}
  const tag = v.assetTag.trim().toLowerCase()
  if (!tag) e.assetTag = 'Enter an asset tag, for example PC-1010.'
  else if (assets.some((a) => a.assetTag.toLowerCase() === tag && a.id !== editingId)) e.assetTag = 'This asset tag is already in use.'
  if (!v.name.trim()) e.name = 'Enter the model name.'
  if (!v.brand.trim()) e.brand = 'Enter the brand.'
  if (!v.purchaseDate) e.purchaseDate = 'Choose the purchase date.'
  if (v.price === '' || Number.isNaN(Number(v.price)) || Number(v.price) < 0) e.price = 'Enter a price of 0 or more.'
  return e
}

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}

export default function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { assets, addAsset, updateAsset, getAsset } = useAssets()
  const editing = id !== undefined
  const existing = editing ? getAsset(id) : undefined

  const [values, setValues] = useState(existing ? { ...existing, price: String(existing.price) } : emptyForm)
  const [errors, setErrors] = useState({})

  if (editing && !existing) {
    return (
      <section>
        <h1>Computer not found</h1>
        <p className="muted">No computer has the ID {id}. It may have been deleted.</p>
        <Link className="btn" to="/">Back to computers</Link>
      </section>
    )
  }

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))
  const props = (field) => ({
    id: field, value: values[field], onChange: set(field),
    'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate(values, assets, existing?.id)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const data = { ...values, assetTag: values.assetTag.trim(), name: values.name.trim(), brand: values.brand.trim(), assignedTo: values.assignedTo.trim(), price: Number(values.price) }
    if (editing) {
      updateAsset(existing.id, data)
      navigate('/', { state: { notice: `${data.assetTag} updated.` } })
    } else {
      addAsset(data)
      navigate('/', { state: { notice: `${data.assetTag} added.` } })
    }
  }

  return (
    <section>
      <h1>{editing ? `Edit ${existing.assetTag}` : 'Add computer'}</h1>
      <form onSubmit={handleSubmit} noValidate className="form">
        <Field id="assetTag" label="Asset tag" error={errors.assetTag}>
          <input type="text" {...props('assetTag')} />
        </Field>
        <Field id="name" label="Model name" error={errors.name}>
          <input type="text" {...props('name')} />
        </Field>
        <Field id="type" label="Type">
          <select {...props('type')}>{ASSET_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field id="brand" label="Brand" error={errors.brand}>
          <input type="text" {...props('brand')} />
        </Field>
        <Field id="assignedTo" label="Assigned to (optional)">
          <input type="text" {...props('assignedTo')} />
        </Field>
        <Field id="purchaseDate" label="Purchase date" error={errors.purchaseDate}>
          <input type="date" {...props('purchaseDate')} />
        </Field>
        <Field id="status" label="Status">
          <select {...props('status')}>{ASSET_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </Field>
        <Field id="price" label="Price (USD)" error={errors.price}>
          <input type="number" min="0" step="0.01" {...props('price')} />
        </Field>
        <div className="form-actions">
          <button type="submit" className="btn primary">{editing ? 'Save changes' : 'Add computer'}</button>
          <Link className="btn" to="/">Cancel</Link>
        </div>
      </form>
    </section>
  )
}
