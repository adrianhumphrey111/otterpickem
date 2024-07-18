import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    console.log(req.body);
    res.status(200).json({ message: 'POST request received' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
