import axios from "axios";

export default async function handler(req, res) {
  const { nomor_kk } = req.body;

  const options = {
    method: 'GET',
    url: 'https://db.bpstuban.my.id/api/v2/tables/me1snqf4cn07esw/records',
    params: {
      where: `(nomor_kk,eq,${nomor_kk})`
    },
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    }
  };

  try {
    const response = await axios.request(options);

    const data = response.data.list;

    return res.status(200).json({ message: "Berhasil", data: data});
  } catch (error) {

    return res.status(500).json({ message: 'Internal server error' });
  }

}
