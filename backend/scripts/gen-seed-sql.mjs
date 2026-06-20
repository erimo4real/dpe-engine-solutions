const hash = '$2a$10$9Q71JBCk54BJmbx7BLD/ou0DqAmPcyhvMckvtfJHkqBFk.Xnb8Gli'
let sql = ''
sql += `INSERT INTO users (username, password_hash) VALUES ('admin', '${hash}') ON CONFLICT (username) DO NOTHING;\n`
sql += "INSERT INTO categories (name, slug, sort_order) VALUES ('Generators', 'generators', 1), ('Engine Parts', 'engine-parts', 2), ('Engines', 'engines', 3) ON CONFLICT (slug) DO NOTHING;\n"

const products = []
const genBase = [
  { name: '10kVA Diesel Generator', desc: 'Heavy-duty diesel generator for industrial backup power. Reliable, fuel-efficient, and built to last.', specs: { power: '10kVA', fuel: 'Diesel', phases: '3-Phase', runtime: '12h', starter: 'Electric', warranty: '1 Year' } },
  { name: '7.5kVA Petrol Generator', desc: 'Quiet petrol generator ideal for home and small office use. Compact design with auto-voltage regulation.', specs: { power: '7.5kVA', fuel: 'Petrol', phases: 'Single Phase', runtime: '10h', starter: 'Recoil', warranty: '1 Year' } },
  { name: '20kVA Silent Generator', desc: 'Soundproof canopy generator for noise-sensitive environments like hospitals and offices.', specs: { power: '20kVA', fuel: 'Diesel', phases: '3-Phase', runtime: '16h', starter: 'Electric', noise: '65dB', warranty: '2 Years' } },
]
for (const p of genBase) products.push({ ...p, cat: 'generators' })

const models = ['5kVA','7.5kVA','10kVA','15kVA','20kVA','25kVA','30kVA','35kVA','40kVA','45kVA','50kVA','60kVA','75kVA','80kVA','100kVA','120kVA','150kVA','200kVA','250kVA','300kVA','350kVA','400kVA','500kVA','600kVA','750kVA','1000kVA','1250kVA','1500kVA','2000kVA','2500kVA']
const descs = ['High-performance diesel generator with auto start. Suitable for industrial and commercial backup.','Heavy-duty generator with low fuel consumption. Ideal for factories, hospitals, and data centers.','Soundproof canopy generator with remote monitoring. Perfect for noise-sensitive environments.','Rugged diesel generator built for continuous operation in harsh conditions.','Premium power solution with paralleling capability for load sharing and redundancy.']
for (let i = 0; i < models.length; i++) {
  products.push({
    name: models[i] + ' Diesel Generator' + (i >= 3 ? ' (Series ' + String.fromCharCode(65 + (i % 6)) + ')' : ''),
    desc: descs[i % 5],
    specs: { power: models[i], fuel: 'Diesel', phases: parseInt(models[i]) >= 100 ? '3-Phase' : 'Single/3-Phase', runtime: (8 + (i % 5) * 2) + 'h', starter: i % 2 === 0 ? 'Electric' : 'Auto Start', warranty: parseInt(models[i]) >= 200 ? '2 Years' : '1 Year' },
    cat: 'generators'
  })
}

const parts = [
  { name: 'Air Filter Element', desc: 'High-quality air filter element compatible with Perkins, Cummins, and Lister engines.', specs: { brand: 'Perkins/Cummins', type: 'Dry Type', part_no: 'AF-1001', material: 'Paper', qty: 'Sold singly' } },
  { name: 'Fuel Injector Nozzle', desc: 'Precision fuel injector nozzle for optimal combustion and fuel economy.', specs: { brand: 'Bosch', type: 'Pencil Nozzle', part_no: 'FI-2001', pressure: '250 bar', qty: 'Sold singly' } },
  { name: 'Cylinder Head Gasket', desc: 'Multi-layer steel cylinder head gasket for high compression engines.', specs: { brand: 'Victor Reinz', type: 'MLS', part_no: 'CHG-3001', material: 'Multi-layer Steel', qty: 'Sold singly' } },
  { name: 'Oil Filter - Perkins', specs: { part_no: 'OF-4001', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Fuel Filter - Cummins', specs: { part_no: 'FF-4002', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Water Pump - Lister', specs: { part_no: 'WP-4003', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Fan Belt - Perkins', specs: { part_no: 'FB-4004', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Radiator Cap - Universal', specs: { part_no: 'RC-4005', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Glow Plug - Perkins', specs: { part_no: 'GP-4006', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Starter Motor - 12V', specs: { part_no: 'SM-4007', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Alternator - 24V', specs: { part_no: 'ALT-4008', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Thermostat - 82C', specs: { part_no: 'TH-4009', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Speed Control Cable', specs: { part_no: 'SC-4010', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Exhaust Manifold Gasket', specs: { part_no: 'EM-4011', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Turbocharger Rebuild Kit', specs: { part_no: 'TC-4012', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Valve Stem Seal Set', specs: { part_no: 'VS-4013', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Piston Ring Set - 100mm', specs: { part_no: 'PR-4014', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Main Bearing Set - Perkins', specs: { part_no: 'MB-4015', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Connecting Rod - Lister', specs: { part_no: 'CR-4016', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Cylinder Liner - 105mm', specs: { part_no: 'CL-4017', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Oil Pump - Perkins', specs: { part_no: 'OP-4018', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Injector Pipe Set', specs: { part_no: 'IP-4019', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Fuel Lift Pump', specs: { part_no: 'FL-4020', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Governor Spring Set', specs: { part_no: 'GS-4021', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Crankshaft Pulley', specs: { part_no: 'CP-4022', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Flywheel Ring Gear', specs: { part_no: 'FR-4023', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
  { name: 'Dipstick - Perkins', specs: { part_no: 'DS-4024', brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' } },
]
for (const p of parts) {
  products.push({
    name: p.name,
    desc: p.desc || 'Genuine quality engine part compatible with Perkins, Cummins, and Lister engines. Part number: ' + p.specs.part_no + '.',
    specs: p.specs,
    cat: 'engine-parts'
  })
}

const engines = [
  { name: 'Perkins 6-Cylinder Diesel Engine', power: '150HP', cyl: 6 },
  { name: 'Cummins 4-Cylinder Diesel Engine', power: '100HP', cyl: 4 },
  { name: 'Cummins 6-Cylinder Diesel Engine', power: '250HP', cyl: 6 },
  { name: 'Lister 4-Cylinder Diesel Engine', power: '60HP', cyl: 4 },
  { name: 'Deutz 3-Cylinder Diesel Engine', power: '45HP', cyl: 3 },
  { name: 'Deutz 6-Cylinder Diesel Engine', power: '180HP', cyl: 6 },
  { name: 'Volvo Penta 4-Cylinder Diesel', power: '90HP', cyl: 4 },
  { name: 'Volvo Penta 6-Cylinder Diesel', power: '200HP', cyl: 6 },
  { name: 'Mitsubishi 4-Cylinder Diesel', power: '75HP', cyl: 4 },
  { name: 'Mitsubishi 6-Cylinder Diesel', power: '160HP', cyl: 6 },
  { name: 'Isuzu 4-Cylinder Diesel Engine', power: '85HP', cyl: 4 },
  { name: 'Isuzu 6-Cylinder Diesel Engine', power: '190HP', cyl: 6 },
  { name: 'John Deere 4-Cylinder Diesel', power: '110HP', cyl: 4 },
  { name: 'John Deere 6-Cylinder Diesel', power: '220HP', cyl: 6 },
  { name: 'Kubota 3-Cylinder Diesel', power: '35HP', cyl: 3 },
  { name: 'Kubota 4-Cylinder Diesel', power: '55HP', cyl: 4 },
  { name: 'Hatz 2-Cylinder Diesel', power: '20HP', cyl: 2 },
  { name: 'Hatz 3-Cylinder Diesel', power: '40HP', cyl: 3 },
  { name: 'Yanmar 3-Cylinder Diesel', power: '30HP', cyl: 3 },
  { name: 'Yanmar 4-Cylinder Diesel', power: '65HP', cyl: 4 },
  { name: 'Perkins 1000 Series Diesel', power: '130HP', cyl: 4 },
  { name: 'Perkins 2000 Series Diesel', power: '300HP', cyl: 6 },
  { name: 'Cummins QSB 4.5 Diesel', power: '170HP', cyl: 4 },
  { name: 'Cummins QSL 9 Diesel', power: '350HP', cyl: 6 },
  { name: 'Lister-Petter Alpha Diesel', power: '50HP', cyl: 2 },
  { name: 'Lister-Petter Beta Diesel', power: '70HP', cyl: 3 },
]
const conds = ['Rebuilt', 'Used - Serviced', 'New', 'Rebuilt', 'Used - Serviced', 'New']
const war = ['6 Months', '3 Months', '1 Year', '6 Months', '3 Months', '1 Year']

for (let i = 0; i < engines.length; i++) {
  const e = engines[i]
  const desc = e.power + ' ' + e.cyl + '-cylinder diesel engine. ' + (i % 3 === 0 ? 'Fully rebuilt with new bearings, rings, and gaskets.' : i % 3 === 1 ? 'Serviced and tested. Ready for installation.' : 'Brand new - factory sealed. Full manufacturer warranty.')
  products.push({
    name: e.name,
    desc: desc,
    specs: { power: e.power, type: 'Diesel', cylinders: e.cyl, condition: conds[i % 6], starter: 'Electric', warranty: war[i % 6] },
    cat: 'engines'
  })
}

function esc(v) { return (v || '').replace(/'/g, "''") }
for (const p of products) {
  const specs = esc(JSON.stringify(p.specs))
  sql += `INSERT INTO products (name, description, specs, category_id, sort_order) SELECT '${esc(p.name)}', '${esc(p.desc)}', '${specs}'::jsonb, id, 0 FROM categories WHERE slug = '${p.cat}' ON CONFLICT DO NOTHING;\n`
}

sql += "INSERT INTO inquiries (name, phone, email, message, status) VALUES ('Emeka Okafor', '+2348030001001', 'emeka@example.com', 'I need a 10kVA diesel generator for my bakery in Ikeja. Do you have stock? What is the lead time for delivery and installation?', 'new');\n"
sql += "INSERT INTO inquiries (name, phone, email, message, status) VALUES ('Adebayo Johnson', '+2348030002002', 'adebayo@example.com', 'Please quote price for cylinder head gasket for Perkins 4-cylinder engine. How many days for delivery to Lagos Island?', 'read');\n"
sql += "INSERT INTO inquiries (name, phone, email, message, status) VALUES ('Chioma Nwachukwu', '+2348030003003', 'chioma@example.com', 'My 7.5kVA generator is leaking oil and vibrating excessively. Can you send a technician to inspect it at my office in VI?', 'replied');\n"

console.log(sql)
