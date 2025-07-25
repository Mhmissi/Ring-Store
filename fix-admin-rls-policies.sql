-- Fix Admin RLS Policies for Ring Images
-- Run this in your Supabase SQL editor to fix the admin panel issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow read access to ring_images" ON ring_images;

-- Create comprehensive policies for ring_images table
-- Allow public read access (for customers)
CREATE POLICY "Allow public read access to ring_images" ON ring_images
    FOR SELECT USING (true);

-- Allow authenticated users to insert (for admin uploads)
CREATE POLICY "Allow authenticated users to insert ring_images" ON ring_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update (for admin edits)
CREATE POLICY "Allow authenticated users to update ring_images" ON ring_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (for admin deletions)
CREATE POLICY "Allow authenticated users to delete ring_images" ON ring_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Fix ring_pricing policies
DROP POLICY IF EXISTS "Allow read access to ring_pricing" ON ring_pricing;

-- Allow public read access to pricing
CREATE POLICY "Allow public read access to ring_pricing" ON ring_pricing
    FOR SELECT USING (true);

-- Allow authenticated users to manage pricing
CREATE POLICY "Allow authenticated users to manage ring_pricing" ON ring_pricing
    FOR ALL USING (auth.role() = 'authenticated');

-- Fix products policies
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;

-- Allow authenticated users full access to products
CREATE POLICY "Allow authenticated users full access to products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages (contact form)
CREATE POLICY "Allow public to insert messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to manage messages (admin)
CREATE POLICY "Allow authenticated users to manage messages" ON messages
    FOR ALL USING (auth.role() = 'authenticated');

-- Create product_discounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design VARCHAR(50) NOT NULL,
    metal VARCHAR(50),
    shape VARCHAR(50),
    discount_percentage DECIMAL(5,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for product_discounts
ALTER TABLE product_discounts ENABLE ROW LEVEL SECURITY;

-- Allow public to read active discounts
CREATE POLICY "Allow public to read active discounts" ON product_discounts
    FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date >= CURRENT_DATE));

-- Allow authenticated users to manage discounts
CREATE POLICY "Allow authenticated users to manage discounts" ON product_discounts
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant all necessary permissions
GRANT ALL ON ring_images TO authenticated;
GRANT ALL ON ring_pricing TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON product_discounts TO authenticated;

-- Grant public read access
GRANT SELECT ON ring_images TO anon;
GRANT SELECT ON ring_pricing TO anon;
GRANT SELECT ON products TO anon;
GRANT INSERT ON messages TO anon;

-- Create trigger for product_discounts updated_at
CREATE TRIGGER update_product_discounts_updated_at BEFORE UPDATE ON product_discounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket policies (run these in Supabase Dashboard > Storage)
-- 1. Go to Storage > Policies
-- 2. For the 'ring-images' bucket, add these policies:

-- Policy for authenticated users to upload files
-- Name: "Allow authenticated uploads"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'ring-images'::text)

-- Policy for authenticated users to update files
-- Name: "Allow authenticated updates"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'ring-images'::text)

-- Policy for authenticated users to delete files
-- Name: "Allow authenticated deletions"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'ring-images'::text)

-- Policy for public to read files
-- Name: "Allow public read access"
-- Operation: SELECT
-- Target roles: anon, authenticated
-- Policy definition: (bucket_id = 'ring-images'::text) 