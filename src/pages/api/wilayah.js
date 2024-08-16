import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://geoportal.big.go.id/sikambing/api/regions/');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching wilayah data', error);
    res.status(500).json({ message: 'Error fetching wilayah data' });
  }
}
