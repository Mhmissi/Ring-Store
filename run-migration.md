# Database Migration Guide - Design-Based Pricing

## Step 1: Run the Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `add-price-columns.sql` into the editor
4. Click **Run** to execute the migration

## Step 2: Verify the Migration

After running the migration, you can verify it worked by running these queries:

```sql
-- Check the new pricing table
SELECT * FROM ring_pricing;

-- Check the updated view
SELECT 
    design,
    metal,
    diamond_shape,
    price_1_0ct,
    price_1_5ct,
    price_2_0ct,
    price_2_5ct
FROM ring_image_summary 
LIMIT 5;
```

## What the Migration Does

1. **Creates a new `ring_pricing` table** with design-based pricing:
   - `design` - The ring design (classic-solitaire, halo-setting, etc.)
   - `price_1_0ct` - Price for 1.0 carat rings
   - `price_1_5ct` - Price for 1.5 carat rings  
   - `price_2_0ct` - Price for 2.0 carat rings
   - `price_2_5ct` - Price for 2.5 carat rings

2. **Sets default prices** for each design:
   - **Classic Solitaire**: $5,000 - $12,500
   - **Halo Setting**: $6,000 - $15,000
   - **Vintage/Antique**: $5,500 - $13,750
   - **Three Stone**: $7,000 - $17,500

3. **Updates the view** to join ring_images with pricing data

## How Pricing Works Now

✅ **Design-Based Pricing**: 
- All metals and shapes for the same design have the same price
- Only carat weight affects the price
- Example: Classic Solitaire in white gold, yellow gold, platinum, round, princess, oval - all same price for same carat

✅ **Price Structure**:
- **Classic Solitaire**: 1.0ct=$5,000, 1.5ct=$7,500, 2.0ct=$10,000, 2.5ct=$12,500
- **Halo Setting**: 1.0ct=$6,000, 1.5ct=$9,000, 2.0ct=$12,000, 2.5ct=$15,000
- **Vintage/Antique**: 1.0ct=$5,500, 1.5ct=$8,250, 2.0ct=$11,000, 2.5ct=$13,750
- **Three Stone**: 1.0ct=$7,000, 1.5ct=$10,500, 2.0ct=$14,000, 2.5ct=$17,500

## New Features Available

After the migration, you'll have:

✅ **Admin Panel Price Management**
- New "Pricing Management" section showing all designs
- Click edit icon to modify prices for each design
- Prices apply to all metals and shapes within that design
- Prices are saved to the `ring_pricing` table

✅ **Dynamic Product Pricing**
- Product pages show prices based on selected carat
- Price updates automatically when carat is changed
- Cart includes the correct price for selected options
- All metals/shapes for same design show same price

✅ **Price Display**
- Admin panel shows current prices for each design
- Product cards display prices for all carat options
- Prices are formatted with proper currency display

## Example Pricing Logic

For a **Classic Solitaire** ring:
- **White Gold Round 1.0ct** = $5,000
- **Yellow Gold Princess 1.0ct** = $5,000  
- **Platinum Oval 1.0ct** = $5,000
- **Rose Gold Round 1.5ct** = $7,500
- **White Gold Princess 2.0ct** = $10,000

The price depends only on **Design + Carat**, not metal or shape!

## Troubleshooting

If you encounter any issues:

1. **Check the migration ran successfully** by verifying both tables exist
2. **Refresh your admin panel** to see the new pricing management section
3. **Clear browser cache** if you don't see the new features immediately
4. **Check browser console** for any JavaScript errors

## Next Steps

1. Run the migration
2. Test the admin panel pricing management
3. Verify product pages show dynamic pricing
4. Test the cart functionality with different carat selections
5. Customize prices for each design as needed 