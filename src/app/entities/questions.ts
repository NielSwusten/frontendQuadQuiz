export interface Questions {
  id: string;
  question: string;
  answers: string[];
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

