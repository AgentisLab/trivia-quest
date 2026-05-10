import { Category, Question } from "./types"
import { sportsQuestions } from "./questions-sports"
import { scienceQuestions } from "./questions-science"
import { geographyQuestions } from "./questions-geography"
import { natureQuestions } from "./questions-nature"
import { popcultureQuestions } from "./questions-popculture"
import { worldQuestions } from "./questions-world"
import { historyQuestions } from "./questions-history"
import { foodQuestions } from "./questions-food"
import { artsQuestions } from "./questions-arts"
import { indigenousQuestions } from "./questions-indigenous"
import { musicQuestions } from "./questions-music"
import { cinemaQuestions } from "./questions-cinema"

export type { Question, Category }
export type { Lang } from "./types"

export const categories: Category[] = [
  {
    id: 1,
    name: { en: "Canadian Sports", fr: "Sports canadiens" },
    icon: "🏒",
    description: { en: "Hockey, CFL, Olympics, lacrosse, and more", fr: "Hockey, LCF, Olympiques, crosse et plus" },
    questions: sportsQuestions,
  },
  {
    id: 2,
    name: { en: "Science & Technology", fr: "Science et technologie" },
    icon: "🔬",
    description: { en: "Canadian innovations, inventions, and discoveries", fr: "Innovations, inventions et découvertes canadiennes" },
    questions: scienceQuestions,
  },
  {
    id: 3,
    name: { en: "Geography", fr: "Géographie" },
    icon: "🗺️",
    description: { en: "Provinces, capitals, rivers, mountains, and landscapes", fr: "Provinces, capitales, rivières, montagnes et paysages" },
    questions: geographyQuestions,
  },
  {
    id: 4,
    name: { en: "Biology & Nature", fr: "Biologie et nature" },
    icon: "🌲",
    description: { en: "Wildlife, national parks, ecosystems, and natural wonders", fr: "Faune, parcs nationaux, écosystèmes et merveilles naturelles" },
    questions: natureQuestions,
  },
  {
    id: 5,
    name: { en: "Fun Facts & Pop Culture", fr: "Culture populaire" },
    icon: "🎬",
    description: { en: "Celebrities, food, media, music, and uniquely Canadian things", fr: "Célébrités, bouffe, médias, musique et choses uniquement canadiennes" },
    questions: popcultureQuestions,
  },
  {
    id: 6,
    name: { en: "World Knowledge", fr: "Connaissances mondiales" },
    icon: "🌍",
    description: { en: "Canada's role in world history, diplomacy, and global affairs", fr: "Le rôle du Canada dans l'histoire mondiale, la diplomatie et les affaires internationales" },
    questions: worldQuestions,
  },
  {
    id: 7,
    name: { en: "Canadian History", fr: "Histoire canadienne" },
    icon: "📜",
    description: { en: "Confederation, wars, prime ministers, treaties, and milestones", fr: "Confédération, guerres, premiers ministres, traités et jalons" },
    questions: historyQuestions,
  },
  {
    id: 8,
    name: { en: "Food & Drink", fr: "Bouffe et boissons" },
    icon: "🍁",
    description: { en: "Regional cuisine, beverages, restaurants, and food culture", fr: "Cuisine régionale, boissons, restaurants et culture culinaire" },
    questions: foodQuestions,
  },
  {
    id: 9,
    name: { en: "Arts & Literature", fr: "Arts et littérature" },
    icon: "🎨",
    description: { en: "Canadian authors, painters, musicians, filmmakers, and cultural institutions", fr: "Auteurs, peintres, musiciens, cinéastes et institutions culturelles canadiens" },
    questions: artsQuestions,
  },
  {
    id: 10,
    name: { en: "Indigenous Peoples", fr: "Peuples autochtones" },
    icon: "🪶",
    description: { en: "First Nations, Inuit, Métis culture, treaties, and history", fr: "Premières Nations, Inuits, culture métisse, traités et histoire" },
    questions: indigenousQuestions,
  },
  {
    id: 11,
    name: { en: "Canadian Music", fr: "Musique canadienne" },
    icon: "🎵",
    description: { en: "Artists, bands, festivals, labels, and decades of Canadian sound", fr: "Artistes, groupes, festivals, étiquettes et décennies de musique d'ici" },
    questions: musicQuestions,
  },
  {
    id: 12,
    name: { en: "Cinema & TV", fr: "Cinéma et télévision" },
    icon: "🎥",
    description: { en: "Canadian directors, actors, films, TV shows, NFB, CBC, and Radio-Canada", fr: "Réalisateurs, acteurs, films, séries télé, ONF, CBC et Radio-Canada" },
    questions: cinemaQuestions,
  },
]
