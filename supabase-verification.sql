-- ========================================
-- SUPABASE SETUP VERIFICATION SCRIPT
-- ========================================
-- Run this script to check what's missing in your Supabase setup

-- 1. CHECK IF TABLES EXIST
-- ========================================

SELECT 'TABLE CHECK' as check_type, 
       table_name as item_name,
       CASE 
         WHEN table_name IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ring_images', 'ring_pricing', 'profiles', 'orders')

UNION ALL

SELECT 'MISSING TABLES' as check_type,
       'ring_images' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'ring_images'
)

UNION ALL

SELECT 'MISSING TABLES' as check_type,
       'ring_pricing' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'ring_pricing'
)

UNION ALL

SELECT 'MISSING TABLES' as check_type,
       'profiles' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'profiles'
)

UNION ALL

SELECT 'MISSING TABLES' as check_type,
       'orders' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'orders'
);

-- 2. CHECK IF INDEXES EXIST
-- ========================================

SELECT 'INDEX CHECK' as check_type,
       indexname as item_name,
       CASE 
         WHEN indexname IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname IN ('idx_ring_images_design', 'idx_ring_images_metal', 'idx_ring_images_shape', 
                  'idx_orders_user_id', 'idx_orders_status', 'idx_orders_created_at')

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_ring_images_design' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_ring_images_design'
)

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_ring_images_metal' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_ring_images_metal'
)

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_ring_images_shape' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_ring_images_shape'
)

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_orders_user_id' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_orders_user_id'
)

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_orders_status' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_orders_status'
)

UNION ALL

SELECT 'MISSING INDEXES' as check_type,
       'idx_orders_created_at' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_indexes 
  WHERE schemaname = 'public' AND indexname = 'idx_orders_created_at'
);

-- 3. CHECK IF RLS IS ENABLED
-- ========================================

SELECT 'RLS CHECK' as check_type,
       schemaname || '.' || tablename as item_name,
       CASE 
         WHEN rowsecurity = true THEN '✅ ENABLED'
         ELSE '❌ DISABLED'
       END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('ring_images', 'ring_pricing', 'profiles', 'orders');

-- 4. CHECK IF POLICIES EXIST
-- ========================================

SELECT 'POLICY CHECK' as check_type,
       policyname as item_name,
       CASE 
         WHEN policyname IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND policyname IN ('Allow read access to ring_images', 'Allow read access to ring_pricing',
                   'Users can view own profile', 'Users can update own profile', 'Users can insert own profile',
                   'Users can view own orders', 'Users can insert own orders')

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Allow read access to ring_images' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Allow read access to ring_images'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Allow read access to ring_pricing' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Allow read access to ring_pricing'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Users can view own profile' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Users can view own profile'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Users can update own profile' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Users can update own profile'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Users can insert own profile' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Users can insert own profile'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Users can view own orders' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Users can view own orders'
)

UNION ALL

SELECT 'MISSING POLICIES' as check_type,
       'Users can insert own orders' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND policyname = 'Users can insert own orders'
);

-- 5. CHECK IF TRIGGERS EXIST
-- ========================================

SELECT 'TRIGGER CHECK' as check_type,
       trigger_name as item_name,
       CASE 
         WHEN trigger_name IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name IN ('update_ring_pricing_updated_at', 'update_profiles_updated_at', 'update_orders_updated_at')

UNION ALL

SELECT 'MISSING TRIGGERS' as check_type,
       'update_ring_pricing_updated_at' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.triggers 
  WHERE trigger_schema = 'public' AND trigger_name = 'update_ring_pricing_updated_at'
)

UNION ALL

SELECT 'MISSING TRIGGERS' as check_type,
       'update_profiles_updated_at' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.triggers 
  WHERE trigger_schema = 'public' AND trigger_name = 'update_profiles_updated_at'
)

UNION ALL

SELECT 'MISSING TRIGGERS' as check_type,
       'update_orders_updated_at' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.triggers 
  WHERE trigger_schema = 'public' AND trigger_name = 'update_orders_updated_at'
);

-- 6. CHECK IF FUNCTION EXISTS
-- ========================================

SELECT 'FUNCTION CHECK' as check_type,
       routine_name as item_name,
       CASE 
         WHEN routine_name IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'update_updated_at_column'

UNION ALL

SELECT 'MISSING FUNCTION' as check_type,
       'update_updated_at_column' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.routines 
  WHERE routine_schema = 'public' AND routine_name = 'update_updated_at_column'
);

-- 7. CHECK IF SAMPLE DATA EXISTS
-- ========================================

SELECT 'SAMPLE DATA CHECK' as check_type,
       'ring_pricing sample data' as item_name,
       CASE 
         WHEN COUNT(*) > 0 THEN '✅ EXISTS (' || COUNT(*) || ' records)'
         ELSE '❌ MISSING'
       END as status
FROM ring_pricing;

-- 8. CHECK IF VIEW EXISTS
-- ========================================

SELECT 'VIEW CHECK' as check_type,
       table_name as item_name,
       CASE 
         WHEN table_name IS NOT NULL THEN '✅ EXISTS'
         ELSE '❌ MISSING'
       END as status
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'ring_image_summary'

UNION ALL

SELECT 'MISSING VIEW' as check_type,
       'ring_image_summary' as item_name,
       '❌ NEEDS TO BE CREATED' as status
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.views 
  WHERE table_schema = 'public' AND table_name = 'ring_image_summary'
);

-- 9. SUMMARY REPORT
-- ========================================

SELECT 
  'SUMMARY' as check_type,
  'Total Tables' as item_name,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('ring_images', 'ring_pricing', 'profiles', 'orders'))::text || '/4' as status

UNION ALL

SELECT 
  'SUMMARY' as check_type,
  'Total Indexes' as item_name,
  (SELECT COUNT(*) FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname IN ('idx_ring_images_design', 'idx_ring_images_metal', 'idx_ring_images_shape', 
                     'idx_orders_user_id', 'idx_orders_status', 'idx_orders_created_at'))::text || '/6' as status

UNION ALL

SELECT 
  'SUMMARY' as check_type,
  'Total Policies' as item_name,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public' 
   AND policyname IN ('Allow read access to ring_images', 'Allow read access to ring_pricing',
                      'Users can view own profile', 'Users can update own profile', 'Users can insert own profile',
                      'Users can view own orders', 'Users can insert own orders'))::text || '/7' as status

UNION ALL

SELECT 
  'SUMMARY' as check_type,
  'Total Triggers' as item_name,
  (SELECT COUNT(*) FROM information_schema.triggers 
   WHERE trigger_schema = 'public' 
   AND trigger_name IN ('update_ring_pricing_updated_at', 'update_profiles_updated_at', 'update_orders_updated_at'))::text || '/3' as status; 