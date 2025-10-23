import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  image_url: string;
  owner_id: string;
  created_at: string;
};

export type VaccinationRecord = {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_administered: string;
  next_due_date: string;
  veterinarian: string;
  notes: string;
  created_at: string;
};

export type DewormingRecord = {
  id: string;
  pet_id: string;
  medicine_name: string;
  date_administered: string;
  next_due_date: string;
  dosage: string;
  notes: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
};

export type Vet = {
  id: string;
  name: string;
  clinic_name: string;
  address: string;
  phone: string;
  rating: number;
  latitude: number;
  longitude: number;
  specialization: string;
  image_url: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  pet_id: string;
  vet_id: string;
  appointment_date: string;
  status: string;
  reason: string;
  notes: string;
  created_at: string;
};
