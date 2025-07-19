-- Migration: Add price management system
-- Run this in your Supabase SQL editor to add price support

-- Create a new pricing table for design-based pricing
CREATE TABLE IF NOT EXISTS ring_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design VARCHAR(50) NOT NULL,
    price_1_0ct DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    price_1_5ct DECIMAL(10,2) NOT NULL DEFAULT 7500.00,
    price_2_0ct DECIMAL(10,2) NOT NULL DEFAULT 10000.00,
    price_2_5ct DECIMAL(10,2) NOT NULL DEFAULT 12500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(design)
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ring_pricing_updated_at 
    BEFORE UPDATE ON ring_pricing 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default pricing for all designs
INSERT INTO ring_pricing (design, price_1_0ct, price_1_5ct, price_2_0ct, price_2_5ct) VALUES
('classic-solitaire', 5000.00, 7500.00, 10000.00, 12500.00),
('halo-setting', 6000.00, 9000.00, 12000.00, 15000.00),
('vintage-antique', 5500.00, 8250.00, 11000.00, 13750.00),
('three-stone', 7000.00, 10500.00, 14000.00, 17500.00)
ON CONFLICT (design) DO NOTHING;

-- Add price columns to ring_images table (for backward compatibility, but we'll use the pricing table)
ALTER TABLE ring_images 
ADD COLUMN IF NOT EXISTS price_1_0ct DECIMAL(10,2) DEFAULT 5000.00,
ADD COLUMN IF NOT EXISTS price_1_5ct DECIMAL(10,2) DEFAULT 7500.00,
ADD COLUMN IF NOT EXISTS price_2_0ct DECIMAL(10,2) DEFAULT 10000.00,
ADD COLUMN IF NOT EXISTS price_2_5ct DECIMAL(10,2) DEFAULT 12500.00;

-- Enable RLS on pricing table
ALTER TABLE ring_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for pricing table
CREATE POLICY "Allow public read access to pricing" ON ring_pricing
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage pricing" ON ring_pricing
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON ring_pricing TO anon;
GRANT SELECT ON ring_pricing TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ring_pricing TO authenticated;

-- Create a view that joins ring_images with pricing
CREATE OR REPLACE VIEW ring_image_summary AS
SELECT 
    ri.metal,
    ri.design,
    ri.diamond_shape,
    ri.carat,
    ri.image_url,
    ri.public_url,
    rp.price_1_0ct,
    rp.price_1_5ct,
    rp.price_2_0ct,
    rp.price_2_5ct,
    ri.created_at
FROM ring_images ri
LEFT JOIN ring_pricing rp ON ri.design = rp.design
ORDER BY ri.created_at DESC; 