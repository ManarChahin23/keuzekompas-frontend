export type VkmApi = {
  _id: string;
  code?: string | null;
  name: string;
  description: string;
  ec?: number | null;
  level?: 'NLQF-5' | 'NLQF-6' | null;
  location?: string | null; 
  learningoutcomes?: string | null;
};


