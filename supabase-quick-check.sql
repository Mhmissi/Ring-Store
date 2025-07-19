-- ========================================
-- QUICK SUPABASE SETUP CHECK
-- ========================================
-- Run this to quickly see what's missing

-- Check Tables
SELECT 'TABLES' as category, 
       string_agg(
         CASE 
           WHEN table_name IS NOT NULL THEN '✅ ' || table_name
           ELSE '❌ ' || expected_table
         END, 
         ', ' ORDER BY expected_table
       ) as status
FROM (
  SELECT table_name, 'ring_images' as expected_table FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ring_images'
  UNION ALL SELECT table_name, 'ring_pricing' FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ring_pricing'
  UNION ALL SELECT table_name, 'profiles' FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles'
  UNION ALL SELECT table_name, 'orders' FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders'
) t
GROUP BY category

UNION ALL

-- Check RLS
SELECT 'RLS' as category,
       string_agg(
         CASE 
           WHEN rowsecurity = true THEN '✅ ' || tablename
           ELSE '❌ ' || tablename
         END,
         ', ' ORDER BY tablename
       ) as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('ring_images', 'ring_pricing', 'profiles', 'orders')

UNION ALL

-- Check Policies
SELECT 'POLICIES' as category,
       (SELECT COUNT(*)::text || '/7' FROM pg_policies WHERE schemaname = 'public') as status

UNION ALL

-- Check Sample Data
SELECT 'SAMPLE DATA' as category,
       CASE 
         WHEN EXISTS (SELECT 1 FROM ring_pricing LIMIT 1) THEN '✅ ring_pricing has data'
         ELSE '❌ No sample pricing data'
       END as status

UNION ALL

-- Check Storage Bucket (manual check needed)
SELECT 'STORAGE' as category,
       '⚠️  Check manually: Create "ring-images" bucket in Storage section' as status; 