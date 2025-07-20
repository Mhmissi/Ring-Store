-- Create product_discounts table for managing product discounts
CREATE TABLE IF NOT EXISTS product_discounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design TEXT NOT NULL,
    metal TEXT,
    shape TEXT,
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_product_discounts_design ON product_discounts(design);
CREATE INDEX IF NOT EXISTS idx_product_discounts_active ON product_discounts(is_active);
CREATE INDEX IF NOT EXISTS idx_product_discounts_dates ON product_discounts(start_date, end_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_product_discounts_updated_at 
    BEFORE UPDATE ON product_discounts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE product_discounts ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage discounts
CREATE POLICY "Admins can manage discounts" ON product_discounts
    FOR ALL USING (
        auth.jwt() ->> 'email' IN ('user123@gmail.com')
    );

-- Policy for public to view active discounts
CREATE POLICY "Public can view active discounts" ON product_discounts
    FOR SELECT USING (
        is_active = true AND 
        start_date <= CURRENT_DATE AND 
        (end_date IS NULL OR end_date >= CURRENT_DATE)
    );

-- Insert some sample discounts (optional)
INSERT INTO product_discounts (design, metal, shape, discount_percentage, start_date, end_date, description, is_active) VALUES
('classic-solitaire', 'white-gold', 'round', 15.00, '2024-01-01', '2024-12-31', 'New Year Special on Classic Solitaire', true),
('halo-setting', 'platinum', 'princess', 20.00, '2024-02-01', '2024-02-29', 'Valentine''s Day Halo Special', true),
('three-stone', 'yellow-gold', 'oval', 10.00, '2024-03-01', '2024-03-31', 'Spring Collection Discount', true);

-- Grant necessary permissions
GRANT ALL ON product_discounts TO authenticated;
GRANT SELECT ON product_discounts TO anon; 