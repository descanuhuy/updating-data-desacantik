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
    const elevenYearsAgo = subYears(now, 11);
    const twentyFourYearsAgo = subYears(now, 24);

    // Filter for individuals aged between 11 to 24 years old
    const filteredData = data.filter(item => {
      const birthDate = parseISO(item.tgl_lahir);

      // Check if birthDate is between twenty-four years ago and eleven years ago
      return isAfter(birthDate, twentyFourYearsAgo) && isBefore(birthDate, elevenYearsAgo);
    });

    return res.status(200).json({ message: "Berhasil", data: filteredData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
