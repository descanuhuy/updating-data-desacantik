import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
      
      if (error || !user) {
        return res.status(404).json({ message: "Username tidak terdaftar" });
      }

      // Verify password
      if (user.password !== password) {
        return res.status(401).json({ message: "Password tidak sesuai" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.NEXT_PUBLIC_JWT_SECRET,
        { expiresIn: '1d' }
      );


      res.setHeader('Set-Cookie', cookie.serialize('token_desacantik', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        sameSite: 'strict',
        path: '/'
      }));

      return res.status(200).json({ message: "Berhasil masuk", token,  username: user.username,
        role: user.role,
        kode_kec: user.kode_kec,
        kode_desa: user.kode_desa, });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
