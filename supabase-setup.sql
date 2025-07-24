-- Supabase Setup for Ring Customizer
-- Run this in your Supabase SQL editor

-- Create ring_images table
CREATE TABLE IF NOT EXISTS ring_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metal VARCHAR(50) NOT NULL,
    design VARCHAR(50) NOT NULL,
    diamond_shape VARCHAR(50) NOT NULL,
    carat DECIMAL(3,1) NOT NULL,
    image_url TEXT NOT NULL,
    public_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ring_pricing table
CREATE TABLE IF NOT EXISTS ring_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design VARCHAR(50) UNIQUE NOT NULL,
    price_1_0ct DECIMAL(10,2) NOT NULL,
    price_1_5ct DECIMAL(10,2) NOT NULL,
    price_2_0ct DECIMAL(10,2) NOT NULL,
    price_2_5ct DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    items JSONB NOT NULL, -- Array of order items with product, qty, price, product_id
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL, -- Object with address details
    payment_info JSONB, -- Object with payment details (last 4 digits, card type)
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ring_images_design ON ring_images(design);
CREATE INDEX IF NOT EXISTS idx_ring_images_metal ON ring_images(metal);
CREATE INDEX IF NOT EXISTS idx_ring_images_shape ON ring_images(diamond_shape);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE ring_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ring_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for ring_images (read-only for all authenticated users)
CREATE POLICY "Allow read access to ring_images" ON ring_images
    FOR SELECT USING (true);

-- Create policies for ring_pricing (read-only for all authenticated users)
CREATE POLICY "Allow read access to ring_pricing" ON ring_pricing
    FOR SELECT USING (true);

-- Create policies for profiles (users can only access their own profile)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for orders (users can only access their own orders)
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ring_pricing_updated_at BEFORE UPDATE ON ring_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample pricing data
INSERT INTO ring_pricing (design, price_1_0ct, price_1_5ct, price_2_0ct, price_2_5ct) VALUES
('classic-solitaire', 5000.00, 7500.00, 10000.00, 12500.00),
('halo-setting', 6500.00, 9750.00, 13000.00, 16250.00),
('vintage-antique', 7500.00, 11250.00, 15000.00, 18750.00),
('three-stone', 8500.00, 12750.00, 17000.00, 21250.00)
ON CONFLICT (design) DO NOTHING;

-- Create a view for easier querying
CREATE OR REPLACE VIEW ring_image_summary AS
SELECT 
    metal,
    design,
    diamond_shape,
    carat,
    image_url,
    public_url,
    price_1_0ct,
    price_1_5ct,
    price_2_0ct,
    price_2_5ct,
    created_at
FROM ring_images
ORDER BY created_at DESC;

-- Grant permissions
GRANT SELECT ON ring_images TO anon;
GRANT SELECT ON ring_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ring_images TO authenticated;

GRANT SELECT ON ring_image_summary TO anon;
GRANT SELECT ON ring_image_summary TO authenticated;

-- Create products table for general and special products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_special BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (is_visible = true);

-- Policy: Allow authenticated users to manage products (customize as needed)
CREATE POLICY "Allow authenticated users to manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;

-- Storage Bucket Setup (run these commands in Supabase Dashboard > Storage)
-- 1. Create a new bucket called 'ring-images'
-- 2. Set the bucket to public
-- 3. Configure CORS if needed

-- Example CORS configuration for the ring-images bucket:
-- [
--   {
--     "origin": "*",
--     "methods": ["GET", "POST", "PUT", "DELETE"],
--     "allowedHeaders": ["*"],
--     "exposedHeaders": ["*"],
--     "maxAgeSeconds": 3600
--   }
-- ]

-- Environment Variables to set in your .env file:
-- REACT_APP_SUPABASE_URL=your_supabase_project_url
-- REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key 