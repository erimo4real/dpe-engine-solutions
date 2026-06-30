import { supabase } from '../config/supabase.js'

export async function getAiReply(message) {
  if (!message || typeof message !== 'string' || message.length > 500) {
    return { error: 'Invalid message' }
  }

  const [{ data: settingsData }, { data: productsData }] = await Promise.all([
    supabase.from('settings').select('data').eq('id', 1).single(),
    supabase.from('products').select('name, description, specs, image_url, categories(name)'),
  ])

  const settings = settingsData?.data || {}
  const products = productsData || []
  const openaiKey = settings.openai_key

  if (!openaiKey) {
    return { reply: 'The admin hasn\'t configured the AI yet. Please call or email us directly using the contact info on this page.' }
  }

  const businessInfo = [
    settings.business_name && `Business: ${settings.business_name}`,
    settings.business_hours && `Hours: ${settings.business_hours}`,
    settings.address && `Address: ${settings.address}`,
    settings.phone && `Phone: ${settings.phone}`,
    settings.email && `Email: ${settings.email}`,
    settings.bank_name && `Bank: ${settings.bank_name}`,
    settings.account_name && `Account Name: ${settings.account_name}`,
    settings.account_number && `Account Number: ${settings.account_number}`,
    settings.payment_methods && `Payment Methods: ${settings.payment_methods}`,
    settings.delivery_areas && `Delivery Areas: ${settings.delivery_areas}`,
    settings.delivery_fee && `Delivery Fee: ${settings.delivery_fee}`,
    settings.lead_time && `Lead Time: ${settings.lead_time}`,
    settings.pricing_notes && `Pricing: ${settings.pricing_notes}`,
  ].filter(Boolean).join('\n')

  const productList = products.slice(0, 20).map((p) =>
    `- ${p.name} (${p.categories?.name || 'Uncategorized'})${p.description ? `: ${p.description}` : ''}${p.specs ? ` Specs: ${JSON.stringify(p.specs)}` : ''}`
  ).join('\n')

  const systemPrompt = `You are a helpful sales assistant for ${settings.business_name || 'DPE Engine Solutions'}. Answer customer questions politely and concisely using the business info and product catalog below. If you don't know something, say so and suggest they call or email. Be friendly but professional.

Business Info:
${businessInfo || 'Not configured yet'}

Product Catalog:
${productList || 'No products listed yet'}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('OpenAI error:', response.status, errText)
    return { error: 'AI service unavailable' }
  }

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I couldn\'t process that.'
  return { reply }
}
