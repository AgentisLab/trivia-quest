// Soft pastel tints keyed by category id, looped for ids beyond 10.
const palette = [
  "#e8f3ff",
  "#f0eaff",
  "#e7faf0",
  "#ecf8e6",
  "#fff0e6",
  "#e6f4f7",
  "#fde9d9",
  "#fff1f0",
  "#fce8f1",
  "#f6efe5",
  "#eef0ff",
  "#f9e7ee",
]

export function categoryIconBg(categoryId: number): string {
  const index = (categoryId - 1) % palette.length
  return palette[Math.max(0, index)]
}
