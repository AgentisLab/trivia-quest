import { Lang } from "./types"

export const ui: Record<string, Record<Lang, string>> = {
  // Brand
  appName: { en: "Trivia Quest", fr: "Quête trivia" },

  // Menu
  greetingMorning: { en: "Good morning", fr: "Bon matin" },
  greetingAfternoon: { en: "Good afternoon", fr: "Bon après-midi" },
  greetingEvening: { en: "Good evening", fr: "Bonsoir" },
  menuTitle: { en: "Tonight's quest.", fr: "Ta quête de ce soir." },

  sectionFeatured: { en: "Featured", fr: "À l'affiche" },
  sectionTrending: { en: "Tonight's most played", fr: "Les plus joués ce soir" },
  sectionAll: { en: "All categories", fr: "Toutes les catégories" },

  recommended: { en: "Recommended", fr: "Recommandé" },
  randomMix: { en: "Random Mix", fr: "Mélange aléatoire" },
  randomMixDesc: { en: "All 12 categories", fr: "Toutes les catégories" },

  // v5 editorial-feed strings
  kickerFeatured: { en: "FEATURED", fr: "À LA UNE" },
  kickerNew: { en: "NEW", fr: "NOUVEAU" },
  kickerSection: { en: "CATEGORIES", fr: "CATÉGORIES" },
  leadDek: {
    en: "A balanced mix across all categories.",
    fr: "Un mélange équilibré, toutes catégories confondues.",
  },
  metaNotPlayed: { en: "not played yet", fr: "jamais joué" },
  metaLastPlayedPrefix: { en: "last played", fr: "dernière partie il y a" },
  metaLastPlayedSuffix: { en: "ago", fr: "" },
  unitMinutes: { en: "min", fr: "min" },
  unitHours: { en: "h", fr: "h" },
  unitDays: { en: "d", fr: "j" },
  unitWeeks: { en: "w", fr: "sem" },

  questionsLabel: { en: "questions", fr: "questions" },
  questionsCount: { en: "Qs", fr: "Qs" },
  secondsEach: { en: "20s each", fr: "20 s chacune" },

  trendingNumberOne: { en: "No. 1", fr: "№ 1" },
  trendingTag: { en: "Trending", fr: "Tendance" },
  newTag: { en: "New", fr: "Nouveau" },
  addedThisWeek: { en: "added this week", fr: "ajouté cette semaine" },

  liveDayStreak: { en: "day streak", fr: "jours d'affilée" },
  livePlayed: { en: "played", fr: "parties" },
  liveStreak: { en: "Streak", fr: "Série" },

  // Game length
  gameLengthPickerLabel: { en: "Questions per round", fr: "Questions par partie" },
  kickerLength: { en: "ROUND LENGTH", fr: "LONGUEUR DE LA PARTIE" },

  // Game
  question: { en: "Question", fr: "Question" },
  of: { en: "of", fr: "sur" },
  questionOfTotalPrefix: { en: "Question", fr: "Question" },
  questionOfTotalJoin: { en: "of", fr: "sur" },
  easy: { en: "Easy", fr: "Facile" },
  medium: { en: "Medium", fr: "Moyen" },
  hard: { en: "Hard", fr: "Difficile" },
  expert: { en: "Expert", fr: "Expert" },
  pts: { en: "pts", fr: "pts" },
  pt: { en: "pt", fr: "pt" },
  tapAnswer: { en: "Tap an answer", fr: "Touche une réponse" },
  nextIn: { en: "Next question", fr: "Question suivante" },
  quitGameTitle: { en: "Quit game?", fr: "Quitter la partie?" },
  quitGameBody: { en: "Your progress in this round will be lost.", fr: "Ta progression dans cette partie sera perdue." },
  quitConfirm: { en: "Quit", fr: "Quitter" },
  quitCancel: { en: "Continue playing", fr: "Continuer la partie" },

  // Results
  summary: { en: "Summary", fr: "Récap" },
  kickerYouPlayed: { en: "YOU PLAYED", fr: "VOUS AVEZ JOUÉ" },
  pullQuoteNearPerfect: { en: "A near-perfect run.", fr: "Une partie presque parfaite." },
  pullQuoteConfident: { en: "A confident performance.", fr: "Une prestation solide." },
  pullQuoteSolid: { en: "Solid play, a few slips.", fr: "Du bon jeu, quelques accrocs." },
  pullQuoteAnotherGo: { en: "Worth another go.", fr: "À refaire." },
  pullQuoteHardRound: { en: "The questions won this round.", fr: "Les questions ont gagné ce tour." },
  accuracy: { en: "accuracy", fr: "précision" },
  bestStreak: { en: "Best streak", fr: "Meilleure série" },
  inARow: { en: "in a row", fr: "d'affilée" },
  totalTime: { en: "Total time", fr: "Temps total" },
  avgPerQuestion: { en: "Average per question", fr: "Moyenne par question" },
  dayStreakLabel: { en: "Day streak", fr: "Série quotidienne" },
  daysUnit: { en: "days", fr: "jours" },
  byDifficulty: { en: "By difficulty", fr: "Par difficulté" },
  playAgain: { en: "Play again", fr: "Rejouer" },
  chooseAnother: { en: "Choose another", fr: "Choisir une autre" },

  // Tab bar
  tabPlay: { en: "Play", fr: "Jouer" },
  tabStats: { en: "Stats", fr: "Stats" },
  tabSettings: { en: "Settings", fr: "Réglages" },

  // Stats page
  statsTitle: { en: "Stats", fr: "Statistiques" },
  statsEmpty: { en: "Play your first round to see stats.", fr: "Joue ta première partie pour voir tes statistiques." },
  statTotalGames: { en: "Games played", fr: "Parties jouées" },
  statAccuracy: { en: "Overall accuracy", fr: "Précision globale" },
  statBestScore: { en: "Best score", fr: "Meilleur score" },
  statCurrentStreak: { en: "Current streak", fr: "Série actuelle" },
  statLongestStreak: { en: "Longest streak", fr: "Plus longue série" },
  statByCategory: { en: "By category", fr: "Par catégorie" },
  statSummary: { en: "Summary", fr: "Sommaire" },
  statStreaks: { en: "Streaks", fr: "Séries" },

  // Settings page
  settingsTitle: { en: "Settings", fr: "Réglages" },
  settingsLanguage: { en: "Language", fr: "Langue" },
  settingsGameplay: { en: "Gameplay", fr: "Jeu" },
  settingsSound: { en: "Sound effects", fr: "Effets sonores" },
  settingsHaptics: { en: "Haptics", fr: "Vibrations" },
  settingsData: { en: "Data", fr: "Données" },
  settingsResetStats: { en: "Reset stats", fr: "Réinitialiser les statistiques" },
  statsResetConfirm: { en: "Reset all stats? This cannot be undone.", fr: "Réinitialiser toutes les statistiques? Cette action est irréversible." },
}
