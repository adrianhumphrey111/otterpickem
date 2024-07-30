export default async function handler(req, res) {
    res.status(200).send();
}export default function handler(req, res) {
  if (req.method === 'GET') {
    const currentDate = new Date();
    const response = {
      month: currentDate.getMonth() + 1, // getMonth() returns 0-11, so we add 1
      date: currentDate.getDate(),
      year: currentDate.getFullYear()
    };
    
    res.status(200).json(response);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
