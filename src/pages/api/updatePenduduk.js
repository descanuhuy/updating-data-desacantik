import { supabase } from './supabase';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const {
      id,
      nomor_kk,
      nik,
      nama_kk,
      nama_pddk,
      jk,
      tempat_lahir,
      tgl_lahir,
      agama,
      pendidikan,
      pekerjaan,
      status_kawin,
      shdk,
      gol_darah,
      status,
      ayah,
      ibu
    } = req.body;

    try {
      const { data, error } = await supabase
        .from('penduduks')
        .update({
          nomor_kk,
          nik,
          nama_kk,
          nama_pddk,
          jk,
          tempat_lahir,
          tgl_lahir,
          agama,
          pendidikan,
          pekerjaan,
          status_kawin,
          shdk,
          gol_darah,
          status,
          ayah,
          ibu,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
