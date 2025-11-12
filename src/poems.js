// src/poems.js
// Poem metadata: id must be unique; file path must match public/poems/... exactly
export const english = [
  { id: "a-way", title: "A Way", file: "/poems/english/A Way.txt" },
  { id: "affection", title: "Affection", file: "/poems/english/Affection.txt", theme: "romantic" },
  { id: "her", title: "Her", file: "/poems/english/Her.txt", theme: "romantic" }, // renamed from Affection pt2
  { id: "as-i-breathe", title: "As I Breathe", file: "/poems/english/As i breathe.txt", theme: "romantic" },
  { id: "eleventh-hour", title: "Eleventh Hour", file: "/poems/english/Eleventh Hour.txt", theme: "sad" },
  { id: "heart-full", title: "Heart Full Of Poems", file: "/poems/english/Heart Full Of Poems.txt", theme: "romantic" },
  { id: "if-i-were", title: "If I Were To Write One Last Poem On You", file: "/poems/english/If I Were To Write One Last Poem On You.txt", theme: "chill" },
  { id: "rant-fest", title: "Rant Fest", file: "/poems/english/Rant Fest.txt", theme: "chill" },
  { id: "coward-poet", title: "Coward poet", file: "/poems/english/Coward poet.txt" },
  // add more english poems here
];

export const urdu = [
  { id: "11th-february", title: "11th February", file: "/poems/urdu/11th February.txt", theme: "chill", latest: true },
  { id: "aakhir-kyun", title: "Aakhir Kyun", file: "/poems/urdu/Aakhir Kyun.txt", theme: "sad" },
  { id: "chaand-si", title: "Chaand si haseen", file: "/poems/urdu/Chaand si haseen.txt", theme: "romantic" },
  { id: "intezaar", title: "Intezaar", file: "/poems/urdu/Intezaar.txt", theme: "chill" },
  { id: "kya-tum", title: "Kya tum sunogi", file: "/poems/urdu/Kya tum sunogi.txt", theme: "romantic" },
  { id: "kyu-nahi", title: "Kyu nahi", file: "/poems/urdu/Kyu nahi.txt", theme: "sad" },
  { id: "manzar", title: "Manzar", file: "/poems/urdu/Manzar.txt", theme: "romantic" },
  { id: "mukhtalif", title: "Mukhtalif", file: "/poems/urdu/Mukhtalif.txt", theme: "sad" },
  { id: "untitled", title: "Untitled", file: "/poems/urdu/Untitled.txt", theme: "chill" },
  { id: "yaad", title: "Yaad", file: "/poems/urdu/Yaad.txt", theme: "chill" },
  // add more urdu poems here
];

export default { english, urdu };
