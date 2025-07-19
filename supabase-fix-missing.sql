-- ========================================
-- FIX MISSING SUPABASE COMPONENTS
-- ========================================
-- This script only creates what's missing

-- 1. CREATE MISSING TABLES
-- ========================================

-- Create ring_images table if missing
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

-- Create ring_pricing table if missing
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

-- Create profiles table if missing
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if missing
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address JSONB NOT NULL,
    payment_info JSONB,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE MISSING INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_ring_images_design ON ring_images(design);
CREATE INDEX IF NOT EXISTS idx_ring_images_metal ON ring_images(metal);
CREATE INDEX IF NOT EXISTS idx_ring_images_shape ON ring_images(diamond_shape);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 3. ENABLE RLS ON TABLES
-- ========================================

ALTER TABLE ring_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ring_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. CREATE MISSING POLICIES
-- ========================================

-- Ring Images policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Allow read access to ring_images') THEN
        CREATE POLICY "Allow read access to ring_images" ON ring_images FOR SELECT USING (true);
    END IF;
END $$;

-- Ring Pricing policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Allow read access to ring_pricing') THEN
        CREATE POLICY "Allow read access to ring_pricing" ON ring_pricing FOR SELECT USING (true);
    END IF;
END $$;

-- Profile policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Order policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Users can view own orders') THEN
        CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND policyname = 'Users can insert own orders') THEN
        CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. CREATE MISSING FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. CREATE MISSING TRIGGERS
-- ========================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name = 'update_ring_pricing_updated_at') THEN
        CREATE TRIGGER update_ring_pricing_updated_at BEFORE UPDATE ON ring_pricing
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name = 'update_orders_updated_at') THEN
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 7. INSERT MISSING SAMPLE DATA
-- ========================================

INSERT INTO ring_pricing (design, price_1_0ct, price_1_5ct, price_2_0ct, price_2_5ct) VALUES
('classic-solitaire', 5000.00, 7500.00, 10000.00, 12500.00),
('halo-setting', 6500.00, 9750.00, 13000.00, 16250.00),
('vintage-antique', 7500.00, 11250.00, 15000.00, 18750.00),
('three-stone', 8500.00, 12750.00, 17000.00, 21250.00)
ON CONFLICT (design) DO NOTHING;

-- 8. CREATE MISSING VIEW
-- ========================================

CREATE OR REPLACE VIEW ring_image_summary AS
SELECT 
    metal,
    design,
    diamond_shape,
    carat,
    image_url,
    public_url,
    created_at
FROM ring_images
ORDER BY created_at DESC;

-- 9. GRANT MISSING PERMISSIONS
-- ========================================

GRANT SELECT ON ring_images TO anon;
GRANT SELECT ON ring_images TO authenticated;
GRANT SELECT ON ring_pricing TO anon;
GRANT SELECT ON ring_pricing TO authenticated;
GRANT SELECT ON ring_image_summary TO anon;
GRANT SELECT ON ring_image_summary TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ring_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ring_pricing TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT ON orders TO authenticated;

-- 10. FINAL STATUS CHECK
-- ========================================

SELECT 'SETUP COMPLETE' as status,
       'All missing components have been created. Run the verification script to confirm.' as message; 