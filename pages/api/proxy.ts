import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;
  
  const n8nUrl = `https://n8n5.urdupic.online/webhook/${String(endpoint).replace(/^\//, '')}`;
  
  try {
    const response = await fetch(n8nUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'finAuto@Team43#2026'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to n8n' });
  }
}
