import axios from "axios";
import { subYears, isBefore, isAfter, parseISO } from 'date-fns';

export default async function handler(req, res) {
  const { kode_kec, kode_desa } = req.body;

  const options = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
    params: {
      where: `(kode_kec,eq,${kode_kec})~and(kode_desa,eq,${kode_desa})`
    },
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data.list;

    // Define the boundary dates
    const now = new Date();
    const oneYearAgo = subYears(now, 1);
    const fourYearsAgo = subYears(now, 4);

    // Filter for children aged between 1 to 4 years old (balita)
    const balita = data.filter(item => {
      const birthDate = parseISO(item.tgl_lahir);

      // Check if birthDate is between four years ago and one year ago
      return isAfter(birthDate, fourYearsAgo) && isBefore(birthDate, oneYearAgo);
    });

    return res.status(200).json({ message: "Berhasil", data: data });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
