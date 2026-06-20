import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dpe_engine_solutions',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

async function seed() {
  try {
    const hash = await bcrypt.hash('admin123', 10)
    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
      ['admin', hash]
    )
    console.log('Admin user created (username: admin, password: admin123)')

    const categories = await pool.query('SELECT id, slug FROM categories ORDER BY id')
    if (categories.rows.length === 0) {
      console.log('No categories found — run initDb first')
      process.exit(1)
    }
    const catMap = Object.fromEntries(categories.rows.map((c) => [c.slug, c.id]))

    const baseProducts = [
      { name: '10kVA Diesel Generator', description: 'Heavy-duty diesel generator for industrial backup power. Reliable, fuel-efficient, and built to last.', specs: { power: '10kVA', fuel: 'Diesel', phases: '3-Phase', runtime: '12h', starter: 'Electric', warranty: '1 Year' }, image: '/images/generator-10kva.jpg', category_slug: 'generators' },
      { name: '7.5kVA Petrol Generator', description: 'Quiet petrol generator ideal for home and small office use. Compact design with auto-voltage regulation.', specs: { power: '7.5kVA', fuel: 'Petrol', phases: 'Single Phase', runtime: '10h', starter: 'Recoil', warranty: '1 Year' }, image: '/images/generator-7kva.jpg', category_slug: 'generators' },
      { name: '20kVA Silent Generator', description: 'Soundproof canopy generator for noise-sensitive environments like hospitals and offices.', specs: { power: '20kVA', fuel: 'Diesel', phases: '3-Phase', runtime: '16h', starter: 'Electric', noise: '65dB', warranty: '2 Years' }, image: '/images/generator-20kva.jpg', category_slug: 'generators' },
      { name: 'Air Filter Element', description: 'High-quality air filter element compatible with Perkins, Cummins, and Lister engines.', specs: { brand: 'Perkins/Cummins', type: 'Dry Type', part_no: 'AF-1001', material: 'Paper', qty: 'Sold singly' }, image: '/images/air-filter.jpg', category_slug: 'engine-parts' },
      { name: 'Fuel Injector Nozzle', description: 'Precision fuel injector nozzle for optimal combustion and fuel economy.', specs: { brand: 'Bosch', type: 'Pencil Nozzle', part_no: 'FI-2001', pressure: '250 bar', qty: 'Sold singly' }, image: '/images/injector.jpg', category_slug: 'engine-parts' },
      { name: 'Cylinder Head Gasket', description: 'Multi-layer steel cylinder head gasket for high compression engines.', specs: { brand: 'Victor Reinz', type: 'MLS', part_no: 'CHG-3001', material: 'Multi-layer Steel', qty: 'Sold singly' }, image: '/images/gasket.jpg', category_slug: 'engine-parts' },
      { name: 'Lister 6-Cylinder Engine', description: 'Rebuilt Lister 6-cylinder diesel engine, 120HP. Suitable for heavy industrial applications.', specs: { power: '120HP', type: 'Diesel', cylinders: 6, condition: 'Rebuilt', starter: 'Electric', warranty: '6 Months' }, image: '/images/engine-lister.jpg', category_slug: 'engines' },
      { name: 'Perkins 4-Cylinder Engine', description: 'Perkins 4-cylinder diesel engine, 80HP. Ideal for generators and agricultural equipment.', specs: { power: '80HP', type: 'Diesel', cylinders: 4, condition: 'Used — serviced', starter: 'Electric', warranty: '3 Months' }, image: '/images/engine-perkins.jpg', category_slug: 'engines' },
    ]

    const generatorModels = [
      '5kVA', '7.5kVA', '10kVA', '15kVA', '20kVA', '25kVA', '30kVA', '35kVA', '40kVA', '45kVA',
      '50kVA', '60kVA', '75kVA', '80kVA', '100kVA', '120kVA', '150kVA', '200kVA', '250kVA', '300kVA',
      '350kVA', '400kVA', '500kVA', '600kVA', '750kVA', '1000kVA', '1250kVA', '1500kVA', '2000kVA',
      '2500kVA',
    ]
    const genDescriptions = [
      'High-performance diesel generator with auto start. Suitable for industrial and commercial backup.',
      'Heavy-duty generator with low fuel consumption. Ideal for factories, hospitals, and data centers.',
      'Soundproof canopy generator with remote monitoring. Perfect for noise-sensitive environments.',
      'Rugged diesel generator built for continuous operation in harsh conditions.',
      'Premium power solution with paralleling capability for load sharing and redundancy.',
    ]

    for (let i = 0; i < generatorModels.length; i++) {
      const kva = generatorModels[i]
      const desc = genDescriptions[i % genDescriptions.length]
      baseProducts.push({
        name: `${kva} Diesel Generator${i >= 3 ? ` (Series ${String.fromCharCode(65 + (i % 6))})` : ''}`,
        description: desc,
        specs: {
          power: kva,
          fuel: 'Diesel',
          phases: parseInt(kva) >= 100 ? '3-Phase' : 'Single/3-Phase',
          runtime: `${8 + (i % 5) * 2}h`,
          starter: i % 2 === 0 ? 'Electric' : 'Auto Start',
          warranty: kva.includes('K') || parseInt(kva) >= 200 ? '2 Years' : '1 Year',
        },
        image: `/images/generator-${kva.toLowerCase().replace('kva', 'kva')}.jpg`,
        category_slug: 'generators',
      })
    }

    const enginePartsVariants = [
      { name: 'Oil Filter — Perkins', part: 'OF-4001' },
      { name: 'Fuel Filter — Cummins', part: 'FF-4002' },
      { name: 'Water Pump — Lister', part: 'WP-4003' },
      { name: 'Fan Belt — Perkins', part: 'FB-4004' },
      { name: 'Radiator Cap — Universal', part: 'RC-4005' },
      { name: 'Glow Plug — Perkins', part: 'GP-4006' },
      { name: 'Starter Motor — 12V', part: 'SM-4007' },
      { name: 'Alternator — 24V', part: 'ALT-4008' },
      { name: 'Thermostat — 82°C', part: 'TH-4009' },
      { name: 'Speed Control Cable', part: 'SC-4010' },
      { name: 'Exhaust Manifold Gasket', part: 'EM-4011' },
      { name: 'Turbocharger Rebuild Kit', part: 'TC-4012' },
      { name: 'Valve Stem Seal Set', part: 'VS-4013' },
      { name: 'Piston Ring Set — 100mm', part: 'PR-4014' },
      { name: 'Main Bearing Set — Perkins', part: 'MB-4015' },
      { name: 'Connecting Rod — Lister', part: 'CR-4016' },
      { name: 'Cylinder Liner — 105mm', part: 'CL-4017' },
      { name: 'Oil Pump — Perkins', part: 'OP-4018' },
      { name: 'Injector Pipe Set', part: 'IP-4019' },
      { name: 'Fuel Lift Pump', part: 'FL-4020' },
      { name: 'Governor Spring Set', part: 'GS-4021' },
      { name: 'Crankshaft Pulley', part: 'CP-4022' },
      { name: 'Flywheel Ring Gear', part: 'FR-4023' },
      { name: 'Dipstick — Perkins', part: 'DS-4024' },
      { name: 'Cylinder Head — Perkins 4-Cyl', part: 'CH-4025' },
    ]

    for (const v of enginePartsVariants) {
      baseProducts.push({
        name: v.name,
        description: `Genuine quality engine part compatible with Perkins, Cummins, and Lister engines. Part number: ${v.part}.`,
        specs: { part_no: v.part, brand: 'OEM/Aftermarket', condition: 'New', warranty: '6 Months', qty: 'Sold singly' },
        image: '/images/engine-part.jpg',
        category_slug: 'engine-parts',
      })
    }

    const engineVariants = [
      { name: 'Perkins 6-Cylinder Diesel Engine', power: '150HP', cylinders: 6 },
      { name: 'Cummins 4-Cylinder Diesel Engine', power: '100HP', cylinders: 4 },
      { name: 'Cummins 6-Cylinder Diesel Engine', power: '250HP', cylinders: 6 },
      { name: 'Lister 4-Cylinder Diesel Engine', power: '60HP', cylinders: 4 },
      { name: 'Deutz 3-Cylinder Diesel Engine', power: '45HP', cylinders: 3 },
      { name: 'Deutz 6-Cylinder Diesel Engine', power: '180HP', cylinders: 6 },
      { name: 'Volvo Penta 4-Cylinder Diesel', power: '90HP', cylinders: 4 },
      { name: 'Volvo Penta 6-Cylinder Diesel', power: '200HP', cylinders: 6 },
      { name: 'Mitsubishi 4-Cylinder Diesel', power: '75HP', cylinders: 4 },
      { name: 'Mitsubishi 6-Cylinder Diesel', power: '160HP', cylinders: 6 },
      { name: 'Isuzu 4-Cylinder Diesel Engine', power: '85HP', cylinders: 4 },
      { name: 'Isuzu 6-Cylinder Diesel Engine', power: '190HP', cylinders: 6 },
      { name: 'John Deere 4-Cylinder Diesel', power: '110HP', cylinders: 4 },
      { name: 'John Deere 6-Cylinder Diesel', power: '220HP', cylinders: 6 },
      { name: 'Kubota 3-Cylinder Diesel', power: '35HP', cylinders: 3 },
      { name: 'Kubota 4-Cylinder Diesel', power: '55HP', cylinders: 4 },
      { name: 'Hatz 2-Cylinder Diesel', power: '20HP', cylinders: 2 },
      { name: 'Hatz 3-Cylinder Diesel', power: '40HP', cylinders: 3 },
      { name: 'Yanmar 3-Cylinder Diesel', power: '30HP', cylinders: 3 },
      { name: 'Yanmar 4-Cylinder Diesel', power: '65HP', cylinders: 4 },
      { name: 'Perkins 1000 Series Diesel', power: '130HP', cylinders: 4 },
      { name: 'Perkins 2000 Series Diesel', power: '300HP', cylinders: 6 },
      { name: 'Cummins QSB 4.5 Diesel', power: '170HP', cylinders: 4 },
      { name: 'Cummins QSL 9 Diesel', power: '350HP', cylinders: 6 },
      { name: 'Lister-Petter Alpha Diesel', power: '50HP', cylinders: 2 },
      { name: 'Lister-Petter Beta Diesel', power: '70HP', cylinders: 3 },
    ]
    const engineCond = ['Rebuilt', 'Used — Serviced', 'New', 'Rebuilt', 'Used — Serviced', 'New']
    const engineWarr = ['6 Months', '3 Months', '1 Year', '6 Months', '3 Months', '1 Year']

    for (const e of engineVariants) {
      const idx = engineVariants.indexOf(e)
      baseProducts.push({
        name: e.name,
        description: `${e.power} ${e.cylinders}-cylinder diesel engine. ${idx % 3 === 0 ? 'Fully rebuilt with new bearings, rings, and gaskets.' : idx % 3 === 1 ? 'Serviced and tested. Ready for installation.' : 'Brand new — factory sealed. Full manufacturer warranty.'}`,
        specs: { power: e.power, type: 'Diesel', cylinders: e.cylinders, condition: engineCond[idx % engineCond.length], starter: 'Electric', warranty: engineWarr[idx % engineWarr.length] },
        image: '/images/engine-generic.jpg',
        category_slug: 'engines',
      })
    }

    const products = baseProducts

    for (const p of products) {
      const catId = catMap[p.category_slug]
      if (!catId) continue
      const { rows: existing } = await pool.query('SELECT id FROM products WHERE name = $1', [p.name])
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO products (name, description, specs, image_url, category_id, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
          [p.name, p.description, JSON.stringify(p.specs), p.image, catId, 0]
        )
      }
    }
    console.log(`${products.length} sample products created`)

    const sampleInquiries = [
      { name: 'Emeka Okafor', phone: '+2348030001001', email: 'emeka@example.com', message: 'I need a 10kVA diesel generator for my bakery in Ikeja. Do you have stock? What is the lead time for delivery and installation?', status: 'new' },
      { name: 'Adebayo Johnson', phone: '+2348030002002', email: 'adebayo@example.com', message: 'Please quote price for cylinder head gasket for Perkins 4-cylinder engine. How many days for delivery to Lagos Island?', status: 'read' },
      { name: 'Chioma Nwachukwu', phone: '+2348030003003', email: 'chioma@example.com', message: 'My 7.5kVA generator is leaking oil and vibrating excessively. Can you send a technician to inspect it at my office in VI?', status: 'replied' },
    ]

    for (const i of sampleInquiries) {
      const { rows: existing } = await pool.query('SELECT id FROM inquiries WHERE name = $1 AND phone = $2', [i.name, i.phone])
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO inquiries (name, phone, email, message, status) VALUES ($1, $2, $3, $4, $5)',
          [i.name, i.phone, i.email, i.message, i.status]
        )
      }
    }
    console.log(`${sampleInquiries.length} sample inquiries created`)

    console.log('Seed complete!')
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
