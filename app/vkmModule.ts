//Interface Vrije Keuze Module

export interface VkmModule {
  id: number;               
  name: string;            
  studycredit: number;     
  location: string;       
  level: string;           
  interests_match_score: number; 
  available_spots: number;  
  start_date: string;      
}