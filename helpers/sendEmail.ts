// import { transporter } from '../config/mailer'
// import nodemailer from 'nodemailer'

import { transporter } from '../config/mailer'

interface Datos {
  email: string
  nombre: string
  token: string
}
export const emailRegistro = async (datos: Datos) => {
  const { email, nombre, token } = datos
  await transporter.sendMail({
    from: '"GestionApp - Administración de negocios" <gestionApp@gestionApp.com>', // sender address
    to: email, // list of receivers
    subject: 'GestionApp - Comprueba tu cuenta', // Subject line
    text: 'Comprueba tu cuenta en GestionApp', // plain text body
    html: `
        <p>Hola ${nombre},</p> 
        <p>Gracias por registrarte en GestionApp.</p>
        <p>Para confirmar tu cuenta, por favor haz click en el siguiente enlace:</p>
        <a href="http://localhost:3000/confirmar/${token}">Confirmar cuenta</a>
    ` // html body
  })
}
export const emailOlvidePassword = async (datos: Datos) => {
  const { email, nombre, token } = datos
  await transporter.sendMail({
    from: '"GestionApp - Administración de negocios" <gestionApp@gestionApp.com>',
    to: email,
    subject: 'GestionApp - Reestablece tu Password',
    text: 'Reestablece tu Password',
    html: `
        <p>Hola ${nombre} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: 
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"></a>
        <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `
  })
}
