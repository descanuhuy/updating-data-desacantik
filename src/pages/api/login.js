import axios from 'axios';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const options = {
      method: 'GET',
      url: 'https://db.bpstuban.my.id/api/v2/tables/m4tmvwaylufkqcj/records',
      params: {
        where: `(username,eq,${username})`
      },
      headers: {
        'xc-token': process.env.NEXT_PUBLIC_XC_TOKEN
      }
    };

    try {
      const response = await axios.request(options);

      const user = response.data.list;

      if (user.length < 1) {
        return res.status(404).json({ message: "Username tidak terdaftar" });
      }

      if (user[0].password !== password) {
        return res.status(401).json({ message: "Password tidak sesuai" });
      }

      const token = jwt.sign(
        { userId: user[0].id, username: user[0].username, role: user[0].role },
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

      return res.status(200).json({ message: "Berhasil masuk", token, username: user[0].username, role: user[0].role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
