// Part 1: data lives in memory (no database). Part 2 replaces this with the REST API.
export const ASSET_TYPES = ['Laptop', 'Desktop', 'Workstation', 'Server', 'Tablet']
export const ASSET_STATUSES = ['In use', 'In stock', 'In repair', 'Retired']

export const initialAssets = [
  { id: 1, assetTag: 'PC-1001', name: 'ThinkPad X1 Carbon', type: 'Laptop', brand: 'Lenovo', assignedTo: 'Sara Al-Qahtani', purchaseDate: '2024-02-12', status: 'In use', price: 1450 },
  { id: 2, assetTag: 'PC-1002', name: 'MacBook Pro 14', type: 'Laptop', brand: 'Apple', assignedTo: 'Omar Haddad', purchaseDate: '2024-05-03', status: 'In use', price: 2199 },
  { id: 3, assetTag: 'PC-1003', name: 'OptiPlex 7010', type: 'Desktop', brand: 'Dell', assignedTo: 'Front desk', purchaseDate: '2022-09-20', status: 'In use', price: 780 },
  { id: 4, assetTag: 'PC-1004', name: 'Precision 5860', type: 'Workstation', brand: 'Dell', assignedTo: 'Design team', purchaseDate: '2023-11-08', status: 'In repair', price: 3400 },
  { id: 5, assetTag: 'SV-2001', name: 'ProLiant DL380 Gen11', type: 'Server', brand: 'HPE', assignedTo: '', purchaseDate: '2023-01-17', status: 'In use', price: 8900 },
  { id: 6, assetTag: 'PC-1005', name: 'iPad Air', type: 'Tablet', brand: 'Apple', assignedTo: '', purchaseDate: '2025-03-25', status: 'In stock', price: 599 },
  { id: 7, assetTag: 'PC-1006', name: 'EliteBook 840 G7', type: 'Laptop', brand: 'HP', assignedTo: '', purchaseDate: '2020-06-30', status: 'Retired', price: 1100 },
  { id: 8, assetTag: 'PC-1007', name: 'ThinkCentre M90q', type: 'Desktop', brand: 'Lenovo', assignedTo: 'Lab 2', purchaseDate: '2024-09-14', status: 'In stock', price: 650 },
]
