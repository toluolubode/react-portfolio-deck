export function getPresenterNotes(slideId: string): string[] {
  const notes: Record<string, string[]> = {
    "title": [
      "Welcome to the presentation.",
      "This is a placeholder note for the title slide.",
      "You can edit these notes in src/app/pages/presentation/presenter-notes.ts"
    ],
    "intro": [
      "Here is the project introduction.",
      "Highlight the main problem we are solving.",
      "Mention the core constraints."
    ],
    "transition": [
      "Transitioning to the next section.",
      "Pause for impact."
    ],
    "results": [
      "These are the key outcomes.",
      "Focus on the primary metric.",
      "Explain the systemic impact."
    ],
    "closing": [
      "Thank you for your time.",
      "Open the floor for questions."
    ]
  };

  return notes[slideId] || ["No notes for this slide."];
}