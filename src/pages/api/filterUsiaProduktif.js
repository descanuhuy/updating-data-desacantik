import axios from "axios";
import { subYears, isBefore, isAfter, parseISO } from 'date-fns';

export default async function handler(req, res) {
  const { kode_kec, kode_desa } = req.body;

  const options = {
    method: 'GET',
    url: 'https://db.bpstuban.my.id/api/v2/tables/me1snqf4cn07esw/records',
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
    const fifteenYearsAgo = subYears(now, 15);
    const sixtyFourYearsAgo = subYears(now, 64);

    // Filter for individuals aged between 15 to 64 years old
    const filteredData = data.filter(item => {
      const birthDate = parseISO(item.tgl_lahir);

      // Check if birthDate is between sixty-four years ago and fifteen years ago
      return isAfter(birthDate, sixtyFourYearsAgo) && isBefore(birthDate, fifteenYearsAgo);
    });

    return res.status(200).json({ message: "Berhasil", data: filteredData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
