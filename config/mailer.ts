import nodemailer from 'nodemailer'

// interface Nodemailer {
//   host: string
//   port: number
//   secure: boolean
//   auth: {
//     user: string
//     pass: string
//   }
// }

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'navaluisrodolfo@gmail.com',
    pass: 'etzrzgsqrdsnonla'
  }
})
transporter.verify().then(() => {
  console.log('Ready for send emails')
})
