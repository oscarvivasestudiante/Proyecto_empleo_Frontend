import type { NextApiRequest, NextApiResponse } from "next";

// Usuario de ejemplo (en producción deberías consultar una base de datos)
const usuarioDemo = {
  email: "demo@demo.com",
  password: "123456",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (email === usuarioDemo.email && password === usuarioDemo.password) {
    // Aquí podrías devolver un token o datos del usuario
    return res.status(200).json({ message: "Login exitoso" });
  } else {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }
}