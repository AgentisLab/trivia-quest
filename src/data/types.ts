export interface Question {
  id: number
  question: { en: string; fr: string }
  options: { A: { en: string; fr: string }; B: { en: string; fr: string }; C: { en: string; fr: string }; D: { en: string; fr: string } }
  answer: "A" | "B" | "C" | "D"
  difficulty: "easy" | "medium" | "hard" | "expert"
}

export interface Category {
  id: number
  name: { en: string; fr: string }
  icon: string
  description: { en: string; fr: string }
  questions: Question[]
}

export type Lang = "en" | "fr"
