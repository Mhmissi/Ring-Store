import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const requiredEnvVars = {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. ` +
    'Please check your .env file and ensure all required variables are set.'
  );
}

const supabaseUrl = requiredEnvVars.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = requiredEnvVars.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ring image utilities
export const getRingImageUrl = async (metal, design, shape, carat) => {
  try {
    // First try to get from database
    const { data } = await supabase
      .from('ring_images')
      .select('image_url')
      .eq('metal', metal)
      .eq('design', design)
      .eq('diamond_shape', shape)
      .eq('carat', parseFloat(carat))
      .single();

    if (data && data.image_url) {
      return data.image_url;
    }

    // Fallback: construct path manually
    const imagePath = `/rings/${metal}/${design}/${shape}/weight-${carat}.png`;
    const { data: storageData } = await supabase.storage
      .from('ring-images')
      .getPublicUrl(imagePath);

    return storageData.publicUrl;
  } catch (error) {
    console.error('Error fetching ring image:', error);
    return '/placeholder-ring.png';
  }
};

// Get progressive ring image (for partial selections)
export const getProgressiveRingImage = async (selections) => {
  const { metal, design, shape, carat } = selections;
  
  // Try to find the best matching image based on what's selected
  if (metal && design && shape && carat) {
    return await getRingImageUrl(metal, design, shape, carat);
  } else if (metal && design && shape) {
    // Use default carat (1.0)
    return await getRingImageUrl(metal, design, shape, '1.0');
  } else if (metal && design) {
    // Use default shape and carat
    return await getRingImageUrl(metal, design, 'round', '1.0');
  } else if (metal) {
    // Use default design, shape, and carat
    return await getRingImageUrl(metal, 'solitaire', 'round', '1.0');
  }
  
  return '/placeholder-ring.png';
}; 