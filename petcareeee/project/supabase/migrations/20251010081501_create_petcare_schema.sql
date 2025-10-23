/*
  # Pet Care App Database Schema

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `name` (text) - Pet's name
      - `type` (text) - Dog, Cat, etc.
      - `breed` (text) - Breed information
      - `age` (integer) - Age in years
      - `image_url` (text) - Pet's photo
      - `owner_id` (uuid) - Reference to user
      - `created_at` (timestamptz)
    
    - `vaccination_records`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `vaccine_name` (text) - Name of vaccine
      - `date_administered` (date) - Date of vaccination
      - `next_due_date` (date) - When next dose is due
      - `veterinarian` (text) - Vet who administered
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
    
    - `deworming_records`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, foreign key to pets)
      - `medicine_name` (text) - Deworming medicine name
      - `date_administered` (date) - Date of treatment
      - `next_due_date` (date) - When next treatment is due
      - `dosage` (text) - Dosage information
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `category` (text) - food, haircare, toys, etc.
      - `description` (text) - Product description
      - `price` (decimal) - Product price
      - `image_url` (text) - Product image
      - `stock` (integer) - Available quantity
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer) - Quantity in cart
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `total_amount` (decimal) - Total order amount
      - `status` (text) - pending, completed, cancelled
      - `payment_method` (text) - Payment method used
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer) - Quantity ordered
      - `price` (decimal) - Price at time of order
      - `created_at` (timestamptz)
    
    - `vets`
      - `id` (uuid, primary key)
      - `name` (text) - Vet name
      - `clinic_name` (text) - Clinic name
      - `address` (text) - Clinic address
      - `phone` (text) - Contact phone
      - `rating` (decimal) - Average rating (0-5)
      - `latitude` (decimal) - Location latitude
      - `longitude` (decimal) - Location longitude
      - `specialization` (text) - Area of expertise
      - `image_url` (text) - Vet/clinic photo
      - `created_at` (timestamptz)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `pet_id` (uuid, foreign key to pets)
      - `vet_id` (uuid, foreign key to vets)
      - `appointment_date` (timestamptz) - Scheduled date and time
      - `status` (text) - pending, confirmed, completed, cancelled
      - `reason` (text) - Reason for visit
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (demo app)
    - Add policies for authenticated operations
*/

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  breed text DEFAULT '',
  age integer DEFAULT 0,
  image_url text DEFAULT '',
  owner_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pets"
  ON pets FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert pets"
  ON pets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update pets"
  ON pets FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete pets"
  ON pets FOR DELETE
  USING (true);

-- Create vaccination_records table
CREATE TABLE IF NOT EXISTS vaccination_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  date_administered date NOT NULL,
  next_due_date date,
  veterinarian text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vaccination records"
  ON vaccination_records FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert vaccination records"
  ON vaccination_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update vaccination records"
  ON vaccination_records FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete vaccination records"
  ON vaccination_records FOR DELETE
  USING (true);

-- Create deworming_records table
CREATE TABLE IF NOT EXISTS deworming_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  date_administered date NOT NULL,
  next_due_date date,
  dosage text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deworming_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view deworming records"
  ON deworming_records FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert deworming records"
  ON deworming_records FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update deworming records"
  ON deworming_records FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete deworming records"
  ON deworming_records FOR DELETE
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  image_url text DEFAULT '',
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage cart items"
  ON cart_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_method text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Create vets table
CREATE TABLE IF NOT EXISTS vets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  clinic_name text NOT NULL,
  address text NOT NULL,
  phone text DEFAULT '',
  rating decimal(2,1) DEFAULT 0.0,
  latitude decimal(10,8),
  longitude decimal(11,8),
  specialization text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vets"
  ON vets FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert vets"
  ON vets FOR INSERT
  WITH CHECK (true);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vet_id uuid NOT NULL REFERENCES vets(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL,
  status text DEFAULT 'pending',
  reason text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage appointments"
  ON appointments FOR ALL
  USING (true)
  WITH CHECK (true);