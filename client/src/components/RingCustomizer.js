import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Heart, 
  Star, 
  Diamond, 
  Circle, 
  Square, 
  CircleDot, 
  ShoppingCart, 
  Crown
} from 'lucide-react';
import { ringOptions, basePrice } from '../data/ringOptions';
import ProgressBar from './ProgressBar';
import { supabase } from '../lib/supabase';
import { useCart } from '../App';
import CustomizationStep from './CustomizationStep';

// Elegant ring SVG for fallback
const RingIcon = (props) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <ellipse cx="32" cy="44" rx="18" ry="14" stroke="currentColor" strokeWidth="4" fill="none" />
      <ellipse cx="32" cy="44" rx="12" ry="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M32 30 L32 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <polygon points="32,8 38,16 26,16" fill="currentColor" opacity="0.7" />
      <polygon points="32,2 36,8 28,8" fill="currentColor" />
      <circle cx="32" cy="16" r="3" fill="currentColor" opacity="0.5" />
    </g>
  </svg>
);

const RingCustomizer = () => {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({ metal: '', design: '', shape: '', carat: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  // Step definitions
  const steps = [
    { id: 1, title: 'Choose Design', icon: Heart },
    { id: 2, title: 'Choose Metal', icon: Crown },
    { id: 3, title: 'Diamond Shape', icon: Diamond },
    { id: 4, title: 'Carat Weight', icon: Star }
  ];

  // Option definitions
  const metals = [
    { value: 'white-gold', label: 'White Gold', icon: Crown },
    { value: 'yellow-gold', label: 'Yellow Gold', icon: Crown },
    { value: 'rose-gold', label: 'Rose Gold', icon: Crown },
    { value: 'platinum', label: 'Platinum', icon: Crown }
  ];
  const designs = [
    { value: 'classic-solitaire', label: 'Classic Solitaire', icon: Circle },
    { value: 'halo-setting', label: 'Halo Setting', icon: CircleDot },
    { value: 'vintage-antique', label: 'Vintage/Antique', icon: Heart },
    { value: 'three-stone', label: 'Three Stone', icon: Star }
  ];
  const shapes = [
    { value: 'round', label: 'Round Brilliant', icon: Circle },
    { value: 'princess', label: 'Princess Cut', icon: Square },
    { value: 'emerald', label: 'Emerald Cut', icon: Square },
    { value: 'oval', label: 'Oval Brilliant', icon: Circle }
  ];
  const carats = [
    { value: '1.0', label: '1.0 Carat', icon: Diamond },
    { value: '1.5', label: '1.5 Carat', icon: Diamond },
    { value: '2.0', label: '2.0 Carat', icon: Diamond },
    { value: '2.5', label: '2.5 Carat', icon: Diamond }
  ];

  const shapeOrder = ['round', 'oval', 'princess', 'emerald']; // preferred order

  const fetchFirstAvailableShape = async (design, metal) => {
    for (const shape of shapeOrder) {
      const imagePath = `rings/${design}/${metal}/${shape}/1.0ct.png`;
      const { data } = supabase.storage.from('ring-images').getPublicUrl(imagePath);
      if (data?.publicUrl) {
        // Test if the image actually exists
        const img = new window.Image();
        const result = await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = data.publicUrl;
        });
        if (result) {
          return shape;
        }
      }
    }
    return null;
  };

  // Generate image path candidates for fallback logic
  const generateImagePathCandidates = () => {
    const { design, metal, shape } = selections;
    if (!design) return ['rings/default/band.png'];
    const candidates = [];
    if (design && metal && shape) candidates.push(`rings/${design}/${metal}/${shape}/1.0ct.png`);
    if (design && metal) candidates.push(`rings/${design}/${metal}/band.png`);
    if (design) candidates.push(`rings/${design}/band.png`);
    candidates.push('rings/default/band.png');
    return candidates;
  };

  // Fetch image with fallback, always show placeholder if not found
  const fetchImage = async () => {
    const candidates = generateImagePathCandidates();
    for (let i = 0; i < candidates.length; i++) {
      const imagePath = candidates[i];
      const { data } = supabase.storage.from('ring-images').getPublicUrl(imagePath);
      if (data?.publicUrl) {
        const img = new window.Image();
        const result = await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = data.publicUrl;
        });
        if (result) {
          setCurrentImage(data.publicUrl);
          setImageError(false);
          return;
        }
      }
    }
    setCurrentImage('/placeholder-ring.png');
    setImageError(true);
  };

  // Update image when selections change
  useEffect(() => {
    setImageError(false);
    fetchImage();
    // eslint-disable-next-line
  }, [selections]);

  // Calculate total price
  useEffect(() => {
    let total = basePrice;
    if (selections.metal) total += ringOptions.metals.find(m => m.id === selections.metal)?.price || 0;
    if (selections.design) total += ringOptions.designs.find(d => d.id === selections.design)?.price || 0;
    if (selections.shape) total += ringOptions.shapes.find(s => s.id === selections.shape)?.price || 0;
    if (selections.carat) total += ringOptions.carats.find(c => c.id === selections.carat)?.price || 0;
    setTotalPrice(total);
  }, [selections]);

  // Show encouragement message
  useEffect(() => {
    if (
      currentStep === 4 &&
      selections.metal && selections.design && selections.shape && selections.carat &&
      !imageError
    ) {
      setShowFloatingMessage(true);
      const timeout = setTimeout(() => setShowFloatingMessage(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentStep, selections, imageError]);

  // Handle step selection, always set defaults when design is chosen
  const handleSelection = async (step, value) => {
    if (step === 'design') {
      // When any design is chosen, always check for the default shape, fallback to first available
      let defaultMetal = 'white-gold';
      let defaultShape = 'round';
      let defaultCarat = '1.0';
      const availableShape = await fetchFirstAvailableShape(value, defaultMetal) || defaultShape;
      setSelections({
        design: value,
        metal: defaultMetal,
        shape: availableShape,
        carat: defaultCarat,
      });
      setImageError(false);
      return;
    }
    if (step === 'metal') {
      // When metal is changed, also check for available shape for the new metal
      let design = selections.design;
      let defaultShape = 'round';
      let defaultCarat = selections.carat || '1.0';
      const availableShape = await fetchFirstAvailableShape(design, value) || defaultShape;
      setSelections(prev => ({
        ...prev,
        metal: value,
        shape: availableShape,
        carat: defaultCarat,
      }));
      setImageError(false);
      return;
    }
    setSelections(prev => ({ ...prev, [step]: value }));
    setImageError(false);
  };

  // Step navigation
  const goToStep = (step) => setCurrentStep(step);

  // Step data for rendering
  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1: return { options: designs, selected: selections.design, onSelect: v => handleSelection('design', v) };
      case 2: return { options: metals, selected: selections.metal, onSelect: v => handleSelection('metal', v) };
      case 3: return { options: shapes, selected: selections.shape, onSelect: v => handleSelection('shape', v) };
      case 4: return { options: carats, selected: selections.carat, onSelect: v => handleSelection('carat', v) };
      default: return null;
    }
  };

  // Progress bar status
  const getProgressStatus = () =>
    steps.map((step, idx) => {
      if (idx < currentStep - 1) {
        return { step: step.id, label: step.title.replace('Choose ', ''), completed: true, current: false };
      } else if (idx === currentStep - 1) {
        return { step: step.id, label: step.title.replace('Choose ', ''), completed: false, current: true };
      } else {
        return { step: step.id, label: step.title.replace('Choose ', ''), completed: false, current: false };
      }
    });

  // Add to cart handler
  const handleAddToCart = async () => {
    if (selections.metal && selections.design && selections.shape && selections.carat) {
      // Look up the real product in ring_images
      const { data: productData, error } = await supabase
        .from('ring_images')
        .select('*')
        .eq('design', selections.design)
        .eq('metal', selections.metal)
        .eq('diamond_shape', selections.shape)
        .eq('carat', selections.carat)
        .single();
      const designLabel = designs.find(d => d.value === selections.design)?.label || selections.design;
      const metalLabel = metals.find(m => m.value === selections.metal)?.label || selections.metal;
      const shapeLabel = shapes.find(s => s.value === selections.shape)?.label || selections.shape;
      let ringProduct;
      if (!error && productData) {
        ringProduct = {
          id: productData.id,
          name: `${designLabel} Ring`,
          design: selections.design,
          designLabel,
          metal: selections.metal,
          metalLabel,
          shape: selections.shape,
          shapeLabel,
          carat: selections.carat,
          price: totalPrice,
          qty: 1,
          image: productData.public_url || productData.image_url || currentImage || '/placeholder-ring.png',
        };
      } else {
        // If the combination does not exist, add a custom ring with the selected carat and a placeholder image
        ringProduct = {
          id: `custom-${Date.now()}`,
          name: `${designLabel} Ring (Custom)` ,
          design: selections.design,
          designLabel,
          metal: selections.metal,
          metalLabel,
          shape: selections.shape,
          shapeLabel,
          carat: selections.carat,
          price: totalPrice,
          qty: 1,
          image: currentImage || '/placeholder-ring.png',
          isCustom: true,
        };
      }
      addToCart(ringProduct);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    } else {
      alert('Please complete all customization steps first');
    }
  };

  // Only allow next step if image is valid and selection is made
  const canAdvance = !imageError && ((currentStep === 1 && selections.design) || (currentStep === 2 && selections.metal) || (currentStep === 3 && selections.shape) || (currentStep === 4 && selections.carat));

  const stepData = getCurrentStepData();

  return (
    <div className="min-h-screen bg-diamondWhite flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-xl px-2 sm:px-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-navyBlue mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Grown Lab Diamond
          </h1>
          <p className="text-xs text-gray-600">Start customizing your dream ring</p>
        </div>
        {/* Ring Preview */}
        <div className="w-full flex flex-col items-center mb-1 relative">
          <div className="w-full flex justify-center items-center">
            {currentImage && !imageError ? (
              <img
                src={currentImage}
                alt="Ring preview"
                className="object-contain max-h-96 w-auto mx-auto bg-platinumSilver rounded-xl border-2 border-brilliantBlue/10"
                style={{ maxWidth: '100%' }}
                onError={() => setImageError(true)}
              />
            ) : imageError ? (
              <div className="w-full max-h-96 flex flex-col items-center justify-center bg-red-50 rounded-lg border-2 border-dashed border-red-300 p-8">
                <RingIcon className="w-16 h-16 text-red-300 mb-4" />
                <h3 className="text-lg font-semibold text-red-600 mb-2">Sorry, this ring preview is not available</h3>
                <p className="text-sm text-red-500 text-center">Please try a different combination to see your dream ring!</p>
              </div>
            ) : (
              <div className="w-full max-h-96 flex flex-col items-center justify-center bg-platinumSilver rounded-lg border-2 border-dashed border-brilliantBlue/10 p-8">
                <Diamond className="w-16 h-16 text-brilliantBlue mb-4" />
                <h3 className="text-lg font-semibold text-brilliantBlue mb-2">Let's make your dream ring</h3>
                <p className="text-sm text-charcoalGray text-center">Start by choosing your metal type below</p>
              </div>
            )}
          </div>
          {/* Floating Message */}
          {showFloatingMessage && (
            <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-10">
              <div className="bg-champagneGold text-black px-3 py-2 rounded-b-lg shadow-lg text-sm font-medium animate-pulse mt-0">
                You have excellent taste in jewelry ✨
              </div>
            </div>
          )}
          {/* Success Message */}
          {added && (
            <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-10">
              <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-bounce mt-4">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Ring added to cart! Redirecting...
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Controls */}
        <div className="w-full flex flex-col gap-0.5 items-center">
          {/* Progress Bar */}
          <div className="w-full text-[10px]">
            <ProgressBar steps={getProgressStatus()} onStepClick={goToStep} tiny />
          </div>
          {/* Current Customization Step */}
          <div className="w-full text-[10px] flex items-center gap-1">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center px-1 py-0.5 text-[10px] bg-platinumSilver border border-brilliantBlue/20 rounded hover:bg-brilliantBlue/10 transition-all duration-150 mr-1"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-3 h-3 mr-0.5" /> Prev
              </button>
            )}
            <div className="flex-1">
              {stepData && stepData.options && (
                <CustomizationStep
                  title={null}
                  description={null}
                  options={stepData.options}
                  selected={stepData.selected}
                  onSelect={stepData.onSelect}
                />
              )}
            </div>
          </div>
          {/* Next Step Button (if not last step) */}
          {currentStep < 4 && (
            <button
              onClick={() => canAdvance && setCurrentStep(currentStep + 1)}
              disabled={!canAdvance}
              className={`mt-1 px-3 py-1 rounded bg-champagneGold text-black text-xs font-semibold shadow-elegant ${!canAdvance ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brilliantBlue hover:text-white'}`}
            >
              Next
            </button>
          )}
          {/* Summary and Add to Cart */}
          <div className="w-full text-[10px]">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center">
                  <Heart className="w-2.5 h-2.5 mr-1 text-champagneGold" />
                  <span className="text-charcoalGray">Design:</span>
                </div>
                <span className="font-medium text-brilliantBlue">
                  {selections.design ? designs.find(d => d.value === selections.design)?.label : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center">
                  <Crown className="w-2.5 h-2.5 mr-1 text-champagneGold" />
                  <span className="text-charcoalGray">Metal:</span>
                </div>
                <span className="font-medium text-brilliantBlue">
                  {selections.metal ? metals.find(m => m.value === selections.metal)?.label : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center">
                  <Diamond className="w-2.5 h-2.5 mr-1 text-brilliantBlue" />
                  <span className="text-charcoalGray">Shape:</span>
                </div>
                <span className="font-medium text-brilliantBlue">
                  {selections.shape ? shapes.find(s => s.value === selections.shape)?.label : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center">
                  <Star className="w-2.5 h-2.5 mr-1 text-champagneGold" />
                  <span className="text-charcoalGray">Carat:</span>
                </div>
                <span className="font-medium text-brilliantBlue">
                  {selections.carat ? carats.find(c => c.value === selections.carat)?.label : 'Not selected'}
                </span>
              </div>
            </div>
            <div className="w-full mt-0.5">
              <button
                onClick={handleAddToCart}
                disabled={!(selections.metal && selections.design && selections.shape && selections.carat)}
                className="w-full flex items-center justify-center py-0.5 text-[10px] bg-gradient-to-r from-brilliantBlue to-champagneGold text-white rounded-md hover:from-champagneGold hover:to-brilliantBlue hover:text-black disabled:from-platinumSilver disabled:to-diamondWhite disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-elegant min-h-0"
              >
                <ShoppingCart className="w-2.5 h-2.5 mr-1" />
                <span>{added ? 'Added!' : 'Add to Cart'}</span>
                <span className="ml-1 px-1 py-0.5 bg-brilliantBlue/10 rounded text-[10px] font-bold">
                  ${totalPrice.toLocaleString()}
                </span>
              </button>
              {!(selections.metal && selections.design && selections.shape && selections.carat) && (
                <p className="text-[10px] text-charcoalGray mt-0.5 text-center">
                  Complete all steps to add to cart
                </p>
              )}
              {selections.metal && selections.design && selections.shape && selections.carat && (
                <div className="text-center mt-1">
                  <p className="text-[10px] text-brilliantBlue font-medium">
                    ✨ Perfect choice! Your dream ring is ready ✨
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingCustomizer; 