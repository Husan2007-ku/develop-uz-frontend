import { redirect } from 'next/navigation'

// Bu marshrut hozircha alohida ishlatilmaydi — /essays sahifasining o'zi
// tanlangan essayni ro'yxat ichida ko'rsatadi. Bo'sh fayl build'ni
// buzmasligi uchun /essays ga yo'naltiramiz.
export default function EssayByIdPage() {
  redirect('/essays')
}
