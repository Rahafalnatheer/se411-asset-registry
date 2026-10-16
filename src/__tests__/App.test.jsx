import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { AssetProvider } from '../context/AssetContext.jsx'
import { teamMembers } from '../pages/About.jsx'

const seed = [
  { id: 1, assetTag: 'PC-1', name: 'Alpha', type: 'Laptop', brand: 'Dell', assignedTo: 'Ann', purchaseDate: '2024-01-01', status: 'In use', price: 100 },
  { id: 2, assetTag: 'PC-2', name: 'Beta', type: 'Desktop', brand: 'HP', assignedTo: '', purchaseDate: '2024-02-02', status: 'In stock', price: 200 },
]
const renderApp = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AssetProvider initial={seed}><App /></AssetProvider>
    </MemoryRouter>,
  )
const change = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('navigation', () => {
  it('menu links reach every page, including About with the team', async () => {
    const user = userEvent.setup()
    renderApp()
    const menu = screen.getByRole('navigation', { name: /main menu/i })
    await user.click(within(menu).getByRole('link', { name: 'Add computer' }))
    expect(screen.getByRole('heading', { name: 'Add computer' })).toBeInTheDocument()
    await user.click(within(menu).getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    teamMembers.forEach((m) => {
      expect(screen.getByText(m.name)).toBeInTheDocument()
      expect(screen.getByText(m.studentId)).toBeInTheDocument()
    })
    await user.click(within(menu).getByRole('link', { name: 'Computers' }))
    expect(screen.getByRole('heading', { name: 'Computers' })).toBeInTheDocument()
  })
})

describe('list (display, search, delete)', () => {
  it('displays all assets', () => {
    renderApp()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filters by search text and by status', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByLabelText('Search'), 'alp')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
    await user.clear(screen.getByLabelText('Search'))
    await user.selectOptions(screen.getByLabelText('Status'), 'In stock')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('deletes an asset after the user confirms', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Delete PC-1' }))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('keeps the asset when the user cancels the confirmation', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Delete PC-1' }))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})

describe('form (add and edit)', () => {
  it('shows validation errors and does not add when fields are empty', async () => {
    const user = userEvent.setup()
    renderApp('/add')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByText(/enter an asset tag/i)).toBeInTheDocument()
    expect(screen.getByText(/enter the model name/i)).toBeInTheDocument()
    expect(screen.getByText(/enter a price/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Add computer' })).toBeInTheDocument()
  })

  it('rejects a duplicate asset tag', async () => {
    const user = userEvent.setup()
    renderApp('/add')
    change('Asset tag', 'pc-1')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByText(/already in use/i)).toBeInTheDocument()
  })

  it('adds a new asset and returns to the list', async () => {
    const user = userEvent.setup()
    renderApp('/add')
    change('Asset tag', 'PC-9')
    change('Model name', 'Gamma')
    change('Brand', 'Asus')
    change('Purchase date', '2025-05-05')
    change('Price (USD)', '999')
    await user.click(screen.getByRole('button', { name: 'Add computer' }))
    expect(screen.getByRole('heading', { name: 'Computers' })).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('PC-9 added')
  })

  it('pre-fills the form in edit mode and saves changes', async () => {
    const user = userEvent.setup()
    renderApp('/edit/1')
    expect(screen.getByLabelText('Model name')).toHaveValue('Alpha')
    change('Model name', 'Alpha Pro')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText('Alpha Pro')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('shows a not-found message for an unknown id', () => {
    renderApp('/edit/99')
    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
  })
})
