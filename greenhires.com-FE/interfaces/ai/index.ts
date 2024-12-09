export interface Mistake {
  original: string;
  corrected: string;
  explanation: string;
}
export interface GrammarCheckProps {
  revised_text: string;
  mistakes: Mistake[];
}

export interface LinterRange {
  from: number;
  to: number;
}
