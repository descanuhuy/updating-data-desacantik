export default function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', 'token_desacantik=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');

    res.redirect('/pages/login');
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
