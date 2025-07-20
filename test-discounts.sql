-- Add test discounts to see the discount display in action
-- Run this in your Supabase SQL editor

-- Clear existing test discounts (optional)
DELETE FROM product_discounts WHERE description LIKE '%Test%';

-- Add test discounts for different products
INSERT INTO product_discounts (design, metal, shape, discount_percentage, start_date, end_date, description, is_active) VALUES
-- Test discount for Classic Solitaire (any metal/shape)
('classic-solitaire', NULL, NULL, 15.00, '2024-01-01', '2024-12-31', 'Test: Classic Solitaire Special', true),

-- Test discount for Halo Setting with specific metal
('halo-setting', 'platinum', NULL, 20.00, '2024-01-01', '2024-12-31', 'Test: Platinum Halo Special', true),

-- Test discount for Three Stone with specific shape
('three-stone', NULL, 'round', 25.00, '2024-01-01', '2024-12-31', 'Test: Round Three Stone Special', true),

-- Test discount for Vintage/Antique with specific combination
('vintage-antique', 'yellow-gold', 'princess', 30.00, '2024-01-01', '2024-12-31', 'Test: Vintage Princess Special', true),

-- Test discount for all products (general sale)
(NULL, NULL, NULL, 10.00, '2024-01-01', '2024-12-31', 'Test: General Sale - All Products', true);

-- Verify the discounts were added
SELECT * FROM product_discounts WHERE description LIKE '%Test%' ORDER BY created_at DESC; 