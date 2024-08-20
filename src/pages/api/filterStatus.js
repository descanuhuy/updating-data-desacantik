import axios from "axios";

export default async function handler(req,res) {
  const { kode_kec, kode_desa, kode_sls, status } = req.body;

  const options = {
    method: 'GET',
    url: process.env.NEXT_PUBLIC_NOCO_PDDK_API,
    params: {
      where: `(kode_kec,eq,${kode_kec})~and(kode_desa,eq,${kode_desa})~and(kode_sls,eq,${kode_sls})~and(status,eq,${status})`
    },
    headers: {
      'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data.pageInfo.totalRows;

    return res.status(200).json({ message: "Berhasil", data: data });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}