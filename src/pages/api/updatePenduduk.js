import { supabase } from "./supabase";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { nomor_kk, sls } = req.body;

    if (!nomor_kk || !sls) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { error } = await supabase
        .from('penduduks')
        .update({
          kode_sls: sls.kode_sls,
          wilayah_terkecil_id: sls.id
        })
        .eq('nomor_kk', nomor_kk);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: 'Update successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
