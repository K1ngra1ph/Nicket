
export interface Prize {
  id: string;
  title: string;
  category: string;
  image: string;
  entryFee: number;
  totalSpots: number;
  spotsLeft: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}
