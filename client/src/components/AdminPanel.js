import React, { useState, useEffect } from 'react';
import { Upload, Image, Settings, Trash2, Eye, AlertCircle, ChevronDown, ChevronRight, DollarSign, Edit3, Gem } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminPanel = () => {
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedCarat, setSelectedCarat] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMetal, setFilterMetal] = useState('');
  const [filterDesign, setFilterDesign] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // {id, imageUrl}
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Price management states
  const [pricingData, setPricingData] = useState([]);
  const [editingPrices, setEditingPrices] = useState(null); // {design, prices}
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceForm, setPriceForm] = useState({
    price_1_0ct: '',
    price_1_5ct: '',
    price_2_0ct: '',
    price_2_5ct: ''
  });

  // Add after other useState hooks
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [orderItemImages, setOrderItemImages] = useState({});
  const [orderActionMessage, setOrderActionMessage] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [messageActionMessage, setMessageActionMessage] = useState("");
  const [viewedMessage, setViewedMessage] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Updated options based on your specifications
  const designs = [
    { value: 'classic-solitaire', label: 'Classic Solitaire' },
    { value: 'halo-setting', label: 'Halo Setting' },
    { value: 'vintage-antique', label: 'Vintage/Antique Style' },
    { value: 'three-stone', label: 'Three Stone (Trinity)' }
  ];

  const metals = [
    { value: 'white-gold', label: 'White Gold (14K/18K)' },
    { value: 'yellow-gold', label: 'Yellow Gold (14K/18K)' },
    { value: 'rose-gold', label: 'Rose Gold (14K/18K)' },
    { value: 'platinum', label: 'Platinum (950)' }
  ];

  const shapes = [
    { value: 'round', label: 'Round Brilliant Cut' },
    { value: 'princess', label: 'Princess Cut (Square)' },
    { value: 'emerald', label: 'Emerald Cut (Rectangular)' },
    { value: 'oval', label: 'Oval Brilliant Cut' }
  ];

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      setMessage('Error fetching orders: ' + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      setMessage('Error fetching messages: ' + error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOrders();
    fetchMessages();
    fetchUploadedImages();
    fetchPricingData();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ring_images')
        .select('*')
        .order('metal', { ascending: true })
        .order('design', { ascending: true })
        .order('diamond_shape', { ascending: true })
        .order('carat', { ascending: true });

      if (error) throw error;
      setUploadedImages(data || []);
      console.log('Updated uploadedImages:', data); // Debug log
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage('Error fetching uploaded images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingData = async () => {
    try {
      const { data, error } = await supabase
        .from('ring_pricing')
        .select('*')
        .order('design', { ascending: true });

      if (error) throw error;
      setPricingData(data || []);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      setMessage('Error fetching pricing data: ' + error.message);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMessage('');
    }
  };

  const uploadImage = async () => {
    // Validate required fields
    if (!selectedFile) {
      setMessage('Please select an image file');
      return;
    }
    if (!selectedDesign || !selectedMetal || !selectedShape) {
      setMessage('Please select all required options (design, metal, shape)');
      return;
    }
    const caratValue = '1.0';
    let path = `rings/${selectedDesign}/${selectedMetal}/${selectedShape}/${caratValue}ct.png`;
    // Check for duplicate (ignore carat)
    const isDuplicate = uploadedImages.some(img =>
      img.design === selectedDesign &&
      img.metal === selectedMetal &&
      img.diamond_shape === selectedShape
    );
    if (isDuplicate) {
      setMessage('An image for this combination already exists');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('ring-images')
        .upload(path, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage error: ${uploadError.message}`);
      }
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('ring-images')
        .getPublicUrl(path);
      // Save metadata to database (carat = 1.0)
      const { error: dbError } = await supabase
        .from('ring_images')
        .insert({
          metal: selectedMetal,
          design: selectedDesign,
          diamond_shape: selectedShape,
          carat: parseFloat(caratValue),
          image_url: path,
          public_url: urlData.publicUrl
        });
      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
      setMessage('✅ Image uploaded successfully!');
      setSelectedFile(null);
      setPreviewUrl('');
      setSelectedMetal('');
      setSelectedDesign('');
      setSelectedShape('');
      setSelectedCarat('');
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      // Refresh the list
      fetchUploadedImages();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('❌ Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id, imageUrl) => {
    // Remove confirm() and use modal instead
    setDeleteTarget({ id, imageUrl });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      // Debug: log the path being deleted
      console.log('Attempting to delete from storage:', deleteTarget.imageUrl);
      const { error: storageError } = await supabase.storage
        .from('ring-images')
        .remove([deleteTarget.imageUrl]);
      if (storageError) {
        console.error('Storage deletion error:', storageError);
        throw storageError;
      }
      // Delete from database
      const { error: dbError } = await supabase
        .from('ring_images')
        .delete()
        .eq('id', deleteTarget.id);
      if (dbError) throw dbError;
      setMessage('✅ Image deleted successfully!');
      setPreviewUrl(''); // Clear preview after delete
      setSelectedFile(null); // Clear selected file after delete
      fetchUploadedImages();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Error deleting image: ' + error.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Price management functions
  const openPriceModal = (design) => {
    const pricing = pricingData.find(p => p.design === design);
    setEditingPrices({ design });
    setPriceForm({
      price_1_0ct: pricing?.price_1_0ct || '',
      price_1_5ct: pricing?.price_1_5ct || '',
      price_2_0ct: pricing?.price_2_0ct || '',
      price_2_5ct: pricing?.price_2_5ct || ''
    });
    setShowPriceModal(true);
  };

  const handlePriceUpdate = async () => {
    if (!editingPrices) return;
    
    try {
      const { error } = await supabase
        .from('ring_pricing')
        .upsert({
          design: editingPrices.design,
          price_1_0ct: parseFloat(priceForm.price_1_0ct) || 0,
          price_1_5ct: parseFloat(priceForm.price_1_5ct) || 0,
          price_2_0ct: parseFloat(priceForm.price_2_0ct) || 0,
          price_2_5ct: parseFloat(priceForm.price_2_5ct) || 0
        });

      if (error) throw error;
      
      setMessage('✅ Prices updated successfully!');
      setShowPriceModal(false);
      setEditingPrices(null);
      fetchPricingData();
    } catch (error) {
      console.error('Error updating prices:', error);
      setMessage('❌ Error updating prices: ' + error.message);
    }
  };

  const closePriceModal = () => {
    setShowPriceModal(false);
    setEditingPrices(null);
    setPriceForm({
      price_1_0ct: '',
      price_1_5ct: '',
      price_2_0ct: '',
      price_2_5ct: ''
    });
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getMetalLabel = (value) => {
    return metals.find(m => m.value === value)?.label || value;
  };

  const getDesignLabel = (value) => {
    return designs.find(d => d.value === value)?.label || value;
  };

  const getShapeLabel = (value) => {
    return shapes.find(s => s.value === value)?.label || value;
  };

  // Get pricing for a design
  const getPricingForDesign = (design) => {
    return pricingData.find(p => p.design === design);
  };

  // Filter and search images
  const filteredImages = uploadedImages.filter(image => {
    const matchesSearch = !searchTerm || 
      image.metal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.design?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.diamond_shape?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.carat?.toString().includes(searchTerm);
    
    const matchesMetal = !filterMetal || image.metal === filterMetal;
    const matchesDesign = !filterDesign || image.design === filterDesign;
    
    return matchesSearch && matchesMetal && matchesDesign;
  });

  // Group images by metal
  const groupedImages = filteredImages.reduce((acc, image) => {
    const metal = image.metal || 'unknown';
    if (!acc[metal]) {
      acc[metal] = [];
    }
    acc[metal].push(image);
    return acc;
  }, {});

  // Helper to generate all possible (design, metal, shape) combinations
  const getAllCombinations = () => {
    const combos = [];
    for (const design of designs) {
      for (const metal of metals) {
        for (const shape of shapes) {
          combos.push({
            design: design.value,
            metal: metal.value,
            shape: shape.value,
          });
        }
      }
    }
    return combos;
  };

  // Check if any image exists for this (design, metal, shape)
  const isUploaded = (combo) => {
    return uploadedImages.some(img =>
      img.design === combo.design &&
      img.metal === combo.metal &&
      img.diamond_shape === combo.shape
    );
  };

  const missingCombinations = getAllCombinations().filter(combo =>
    combo.design && combo.metal && combo.shape && !isUploaded(combo)
  );

  // Helper to fetch product images for order items
  async function fetchOrderItemImages(items) {
    // Only fetch for items with product_id
    const ids = items.filter(i => i.product_id).map(i => i.product_id);
    if (ids.length === 0) return {};
    const { data, error } = await supabase
      .from('ring_images')
      .select('id, public_url, image_url, design, metal, diamond_shape, carat')
      .in('id', ids);
    if (error) return {};
    const map = {};
    for (const prod of data) {
      map[prod.id] = prod;
    }
    return map;
  }

  // Fetch product images when an order is expanded
  useEffect(() => {
    const loadImages = async () => {
      if (!expandedOrderId) return;
      const order = orders.find(o => o.id === expandedOrderId);
      if (!order || !Array.isArray(order.items)) return;
      const images = await fetchOrderItemImages(order.items);
      setOrderItemImages(images);
    };
    loadImages();
    // eslint-disable-next-line
  }, [expandedOrderId]);

  // Handler to update order status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      setOrderActionMessage('Order status updated!');
      fetchOrders();
      setTimeout(() => setOrderActionMessage(''), 2000);
    } catch (err) {
      setOrderActionMessage('Error updating order status: ' + err.message);
      setTimeout(() => setOrderActionMessage(''), 3000);
    }
  };

  // Handler to delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    setDeletingOrderId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      if (error) throw error;
      setOrderActionMessage('Order deleted!');
      fetchOrders();
      setTimeout(() => setOrderActionMessage(''), 2000);
    } catch (err) {
      setOrderActionMessage('Error deleting order: ' + err.message);
      setTimeout(() => setOrderActionMessage(''), 3000);
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Handler to update message status
  const handleMessageStatusChange = async (msgId, newStatus) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: newStatus })
        .eq('id', msgId);
      if (error) throw error;
      setMessageActionMessage('Message status updated!');
      fetchMessages();
      setTimeout(() => setMessageActionMessage(''), 2000);
    } catch (err) {
      setMessageActionMessage('Error updating message: ' + err.message);
      setTimeout(() => setMessageActionMessage(''), 3000);
    }
  };

  // Handler to delete message
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    setDeletingMessageId(msgId);
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', msgId);
      if (error) throw error;
      setMessageActionMessage('Message deleted!');
      fetchMessages();
      setTimeout(() => setMessageActionMessage(''), 2000);
    } catch (err) {
      setMessageActionMessage('Error deleting message: ' + err.message);
      setTimeout(() => setMessageActionMessage(''), 3000);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Handler to send reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !viewedMessage) return;
    setSendingReply(true);
    try {
      const { error } = await supabase
        .from('messages')
        .update({ reply: replyText, replied_at: new Date().toISOString(), status: 'responded' })
        .eq('id', viewedMessage.id);
      if (error) throw error;
      setMessageActionMessage('Reply sent and saved!');
      setViewedMessage({ ...viewedMessage, reply: replyText, replied_at: new Date().toISOString(), status: 'responded' });
      setReplyText("");
      fetchMessages();
      setTimeout(() => setMessageActionMessage(''), 2000);
    } catch (err) {
      setMessageActionMessage('Error sending reply: ' + err.message);
      setTimeout(() => setMessageActionMessage(''), 3000);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="bg-diamondWhite min-h-screen py-10 px-2 font-sans">
      <div className="max-w-6xl mx-auto bg-platinumSilver rounded-2xl shadow-elegant border border-brilliantBlue/10 p-6 sm:p-10">
        <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-brilliantBlue mb-8 text-center tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Panel</h2>
        {/* Tab Bar */}
        <div className="flex justify-center space-x-12 mb-8 border-b border-brilliantBlue/30 bg-brilliantBlue/5 pt-2 pb-1 shadow-sm">
          {[
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'messages', label: 'Messages' },
            { key: 'reviews', label: 'Reviews' },
            { key: 'settings', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-2 pb-2 text-lg font-semibold transition focus:outline-none ${activeTab === tab.key ? 'text-brilliantBlue' : 'text-champagneGold hover:text-brilliantBlue'}`}
              style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.01em' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute left-0 right-0 -bottom-1 h-1 bg-gradient-to-r from-brilliantBlue to-champagneGold rounded-full" style={{ boxShadow: '0 2px 8px #e0b97f33' }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        {activeTab === 'products' && (
          <>
            {/* Header */}
            <div className="bg-brilliantBlue/5 rounded-xl p-6 mb-8 shadow-sm border border-brilliantBlue/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-brilliantBlue">Ring Image Management</h1>
                  <p className="text-champagneGold mt-1">Upload and manage ring images for the customization system</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-champagneGold" />
                  <span className="text-sm text-champagneGold">Admin Panel</span>
                </div>
              </div>
              
              {/* Message Display */}
              {message && (
                <div className={`p-3 rounded-md mb-4 ${
                  message.includes('✅') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : message.includes('❌') 
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  {message}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10" id="upload-section">
                <h2 className="text-xl font-semibold text-brilliantBlue mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-brilliantBlue" />
                  Upload New Image
                </h2>
                
                <div className="space-y-4">
                  {/* Design Selection */}
                  <div>
                    <label className="block text-sm font-medium text-champagneGold mb-2">
                      Design * <span className="text-red-500">Required</span>
                    </label>
                    <select
                      value={selectedDesign}
                      onChange={(e) => setSelectedDesign(e.target.value)}
                      className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    >
                      <option value="">Select Design</option>
                      {designs.map(design => (
                        <option key={design.value} value={design.value}>
                          {design.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Metal Selection */}
                  <div>
                    <label className="block text-sm font-medium text-champagneGold mb-2">
                      Metal
                    </label>
                    <select
                      value={selectedMetal}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    >
                      <option value="">Select Metal (Optional)</option>
                      {metals.map(metal => (
                        <option key={metal.value} value={metal.value}>
                          {metal.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shape Selection */}
                  <div>
                    <label className="block text-sm font-medium text-champagneGold mb-2">
                      Diamond Shape
                    </label>
                    <select
                      value={selectedShape}
                      onChange={(e) => setSelectedShape(e.target.value)}
                      className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    >
                      <option value="">Select Shape (Optional)</option>
                      {shapes.map(shape => (
                        <option key={shape.value} value={shape.value}>
                          {shape.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-champagneGold mb-2">
                      Image File * <span className="text-red-500">Required</span>
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    />
                    <p className="text-xs text-champagneGold mt-1">
                      Supported formats: PNG, JPG, WebP. Max size: 5MB
                    </p>
                  </div>

                  {/* Preview */}
                  {previewUrl && (
                    <div>
                      <label className="block text-sm font-medium text-champagneGold mb-2">
                        Preview
                      </label>
                      <div className="border border-brilliantBlue/30 rounded-md p-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full h-32 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={uploadImage}
                    disabled={uploading || !selectedFile || !selectedDesign}
                    className="bg-brilliantBlue/10 text-brilliantBlue font-bold rounded-full px-6 py-2 shadow hover:from-champagneGold hover:to-brilliantBlue hover:text-black transition border border-brilliantBlue focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Image Management Section */}
              <div className="bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10">
                <h2 className="text-xl font-semibold text-brilliantBlue mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-green-500" />
                  Manage Images
              </h2>

                {/* Search and Filter */}
                <div className="mb-4 space-y-2">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterMetal('');
                        setFilterDesign('');
                      }}
                      className="px-3 py-2 text-sm text-champagneGold hover:text-brilliantBlue"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={filterMetal}
                      onChange={(e) => setFilterMetal(e.target.value)}
                      className="flex-1 px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    >
                      <option value="">All Metals</option>
                      {metals.map(metal => (
                        <option key={metal.value} value={metal.value}>
                          {metal.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterDesign}
                      onChange={(e) => setFilterDesign(e.target.value)}
                      className="flex-1 px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brilliantBlue"
                    >
                      <option value="">All Designs</option>
                      {designs.map(design => (
                        <option key={design.value} value={design.value}>
                          {design.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image List */}
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brilliantBlue"></div>
                    </div>
                  ) : filteredImages.length === 0 ? (
                    <div className="text-center py-8 text-champagneGold">
                      <Image className="w-12 h-12 mx-auto mb-2 text-champagneGold" />
                      <p>No images found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(groupedImages).map(([metal, images]) => (
                        <div key={metal} className="border border-brilliantBlue/30 rounded-md">
                          <button
                            onClick={() => toggleSection(metal)}
                            className="w-full px-4 py-2 bg-brilliantBlue/5 hover:bg-brilliantBlue/10 flex items-center justify-between text-left"
                          >
                            <span className="font-medium text-champagneGold">
                              {getMetalLabel(metal)} ({images.length})
                            </span>
                            {expandedSections[metal] ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          
                          {expandedSections[metal] && (
                            <div className="p-4 space-y-2">
                              {images.map((image) => {
                                const pricing = getPricingForDesign(image.design);
                                return (
                                  <div key={image.id} className="flex items-center justify-between p-2 bg-brilliantBlue/5 border border-brilliantBlue/30 rounded">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={image.public_url}
                                        alt="Ring"
                                        className="w-12 h-12 object-cover rounded"
                                        onError={(e) => {
                                          e.target.src = '/placeholder-ring.png';
                                        }}
                                      />
                                      <div>
                                        <p className="text-sm font-medium text-brilliantBlue">
                                          {getDesignLabel(image.design)}
                                        </p>
                                        <p className="text-xs text-champagneGold">
                                          {image.diamond_shape && getShapeLabel(image.diamond_shape)}
                                          {image.carat && ` • ${image.carat}ct`}
                                        </p>
                                        <p className="text-xs text-green-600 font-medium">
                                          1.0ct: ${pricing?.price_1_0ct?.toLocaleString() || '—'} | 
                                          1.5ct: ${pricing?.price_1_5ct?.toLocaleString() || '—'} | 
                                          2.0ct: ${pricing?.price_2_0ct?.toLocaleString() || '—'} | 
                                          2.5ct: ${pricing?.price_2_5ct?.toLocaleString() || '—'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => openPriceModal(image.design)}
                                        className="p-1 text-champagneGold hover:text-green-500"
                                        title="Edit prices for this design"
                                      >
                                        <DollarSign className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => window.open(image.public_url, '_blank')}
                                        className="p-1 text-champagneGold hover:text-brilliantBlue"
                                        title="View image"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteImage(image.id, image.image_url)}
                                        className="p-1 text-champagneGold hover:text-red-500"
                                        title="Delete image"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Management Section */}
              <div className="mt-8 bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10">
                <h2 className="text-xl font-semibold text-brilliantBlue mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Pricing Management
                </h2>
                <p className="text-champagneGold mb-4">
                  Set prices for each design. Prices are the same for all metals and shapes within a design.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {designs.map(design => {
                    const pricing = getPricingForDesign(design.value);
                    return (
                      <div key={design.value} className="border border-brilliantBlue/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-brilliantBlue">{design.label}</h3>
                          <button
                            onClick={() => openPriceModal(design.value)}
                            className="p-1 text-champagneGold hover:text-green-500"
                            title="Edit prices"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>1.0ct: ${pricing?.price_1_0ct?.toLocaleString() || '—'}</div>
                          <div>1.5ct: ${pricing?.price_1_5ct?.toLocaleString() || '—'}</div>
                          <div>2.0ct: ${pricing?.price_2_0ct?.toLocaleString() || '—'}</div>
                          <div>2.5ct: ${pricing?.price_2_5ct?.toLocaleString() || '—'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-8 bg-brilliantBlue/5 rounded-xl p-6 shadow-sm border border-brilliantBlue/10">
                <h3 className="text-lg font-semibold text-brilliantBlue mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-brilliantBlue/10 rounded-lg">
                    <div className="text-2xl font-bold text-brilliantBlue">{uploadedImages.length}</div>
                    <div className="text-sm text-champagneGold">Total Images</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(uploadedImages.map(img => img.metal)).size}
                    </div>
                    <div className="text-sm text-champagneGold">Metals</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(uploadedImages.map(img => img.design)).size}
                    </div>
                    <div className="text-sm text-champagneGold">Designs</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {new Set(uploadedImages.map(img => img.diamond_shape)).size}
                    </div>
                    <div className="text-sm text-champagneGold">Shapes</div>
                  </div>
                </div>
              </div>

              {/* Section: Uploaded Images Grid */}
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 text-green-700">Uploaded Images ({uploadedImages.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {uploadedImages.map((img, idx) => {
                    const pricing = getPricingForDesign(img.design);
                    return (
                      <div key={img.id || idx} className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center">
                        <img
                          src={img.image_url ? supabase.storage.from('ring-images').getPublicUrl(img.image_url).data.publicUrl + `?t=${Date.now()}` : '/placeholder-ring.png'}
                          alt={`${img.design} ${img.metal} ${img.diamond_shape}`}
                          className="w-32 h-32 object-contain mb-2 rounded shadow"
                          onError={e => { e.target.src = '/placeholder-ring.png'; }}
                        />
                        <div className="font-semibold mb-1">{getDesignLabel(img.design)}</div>
                        <div className="mb-1">{getMetalLabel(img.metal)}</div>
                        <div className="mb-1">{getShapeLabel(img.diamond_shape)}</div>
                        <div className="text-xs text-green-600 mb-2 text-center">
                          <div>1.0ct: ${pricing?.price_1_0ct?.toLocaleString() || '—'}</div>
                          <div>1.5ct: ${pricing?.price_1_5ct?.toLocaleString() || '—'}</div>
                          <div>2.0ct: ${pricing?.price_2_0ct?.toLocaleString() || '—'}</div>
                          <div>2.5ct: ${pricing?.price_2_5ct?.toLocaleString() || '—'}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-700 transition text-xs"
                            onClick={() => openPriceModal(img.design)}
                          >
                            <DollarSign className="w-3 h-3 inline mr-1" />
                            Prices
                          </button>
                          <button
                            className="bg-red-500 text-white font-bold px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                            onClick={() => deleteImage(img.id, img.image_url)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section: Missing Images Grid */}
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 text-red-700">Images to Upload ({missingCombinations.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {missingCombinations.map((combo, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center">
                      <div className="font-semibold mb-2">{designs.find(d => d.value === combo.design)?.label}</div>
                      <div className="mb-1">{metals.find(m => m.value === combo.metal)?.label}</div>
                      <div className="mb-1">{shapes.find(s => s.value === combo.shape)?.label}</div>
                      {/* No carat shown, since not required */}
                      <button
                        className="bg-champagneGold text-black font-bold px-4 py-2 rounded hover:bg-black hover:text-champagneGold transition"
                        onClick={() => {
                          setSelectedDesign(combo.design);
                          setSelectedMetal(combo.metal);
                          setSelectedShape(combo.shape);
                          setSelectedCarat(''); // No carat pre-selected
                          const uploadSection = document.getElementById('upload-section');
                          if (uploadSection) {
                            uploadSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Upload
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'orders' && (
          <div className="mt-8">
            {/* Header */}
            <div className="bg-brilliantBlue/5 rounded-xl p-6 mb-8 shadow-sm border border-brilliantBlue/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-brilliantBlue">Order Management</h1>
                  <p className="text-champagneGold mt-1">View and manage customer orders</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-champagneGold" />
                  <span className="text-sm text-champagneGold">Admin Panel</span>
                </div>
              </div>
              
              {/* Message Display */}
              {message && (
                <div className={`p-3 rounded-md mb-4 ${
                  message.includes('✅') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : message.includes('❌') 
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  {message}
                </div>
              )}
              {orderActionMessage && (
                <div className="p-3 rounded-md mb-4 bg-blue-50 border border-blue-200 text-blue-700">
                  {orderActionMessage}
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-[15px]">
                <thead>
                  <tr className="text-champagneGold font-bold text-base border-b border-brilliantBlue/40">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Total</th>
                    <th className="py-2 px-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-champagneGold">Loading orders...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-champagneGold">No orders found.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <React.Fragment key={order.id}>
                        <tr className="border-t border-brilliantBlue/10 hover:bg-brilliantBlue/10 transition">
                          <td className="py-2 px-3 font-mono text-brilliantBlue">{order.id.slice(0, 8)}...</td>
                          <td className="py-2 px-3 text-brilliantBlue">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="py-2 px-3 text-brilliantBlue">{order.shipping_address?.email || order.user_id}</td>
                          <td className="py-2 px-3 text-brilliantBlue">
                            <select
                              value={order.status}
                              onChange={e => handleOrderStatusChange(order.id, e.target.value)}
                              className="rounded border border-brilliantBlue/30 px-2 py-1 bg-white text-brilliantBlue focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40"
                              style={{ minWidth: 100 }}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-brilliantBlue">${order.total?.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="text-brilliantBlue underline text-sm">{expandedOrderId === order.id ? 'Hide' : 'View'}</button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                              disabled={deletingOrderId === order.id}
                            >
                              {deletingOrderId === order.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && (
                          <tr>
                            <td colSpan={6} className="bg-brilliantBlue/5 p-4">
                              <div>
                                <strong>Items:</strong>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                  {Array.isArray(order.items) ? order.items.map((item, i) => {
                                    const prod = item.product_id ? orderItemImages[item.product_id] : null;
                                    const imageUrl = prod?.public_url || prod?.image_url || '/placeholder-ring.png';
                                    return (
                                      <div key={i} className="flex items-center bg-white rounded-xl shadow border border-brilliantBlue/20 p-3 gap-4">
                                        <img
                                          src={imageUrl}
                                          alt={item.product}
                                          className="w-16 h-16 rounded shadow border border-brilliantBlue/20 object-cover bg-gray-50"
                                          onError={e => { e.target.src = '/placeholder-ring.png'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-semibold text-brilliantBlue truncate">{item.product}</div>
                                          <div className="text-champagneGold text-sm">Qty: {item.qty} &bull; ${item.price}</div>
                                          {prod && (
                                            <div className="text-xs text-champagneGold mt-1">
                                              {prod.design} &bull; {prod.metal} &bull; {prod.diamond_shape} &bull; {prod.carat}ct
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }) : <div>-</div>}
                                </div>
                                <div className="mt-4">
                                  <strong>Shipping Address:</strong>
                                  <div className="ml-4 text-sm">
                                    {order.shipping_address ? (
                                      <>
                                        <div>{order.shipping_address.firstName} {order.shipping_address.lastName}</div>
                                        <div>{order.shipping_address.address}</div>
                                        <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</div>
                                        <div>{order.shipping_address.country}</div>
                                        <div>{order.shipping_address.phone}</div>
                                      </>
                                    ) : 'N/A'}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <strong>Payment Info:</strong>
                                  <div className="ml-4 text-sm">
                                    {order.payment_info ? (
                                      <>
                                        <div>Card: **** **** **** {order.payment_info.cardLast4}</div>
                                        <div>Type: {order.payment_info.cardType}</div>
                                      </>
                                    ) : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="mt-8">
            {/* Header */}
            <div className="bg-brilliantBlue/5 rounded-xl p-6 mb-8 shadow-sm border border-brilliantBlue/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-brilliantBlue">Message Management</h1>
                  <p className="text-champagneGold mt-1">View and manage customer messages</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-champagneGold" />
                  <span className="text-sm text-champagneGold">Admin Panel</span>
                </div>
              </div>
              
              {/* Message Display */}
              {message && (
                <div className={`p-3 rounded-md mb-4 ${
                  message.includes('✅') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : message.includes('❌') 
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  {message}
                </div>
              )}
              {messageActionMessage && (
                <div className="p-3 rounded-md mb-4 bg-blue-50 border border-blue-200 text-blue-700">
                  {messageActionMessage}
                </div>
              )}
            </div>

            {/* Messages Section */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-[15px]">
                <thead>
                  <tr className="text-champagneGold font-bold text-base border-b border-brilliantBlue/40">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Message</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messagesLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-champagneGold">Loading messages...</td>
                    </tr>
                  ) : messages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-champagneGold">No messages found.</td>
                    </tr>
                  ) : (
                    messages.map(msg => (
                      <tr key={msg.id} className="border-t border-brilliantBlue/10 hover:bg-brilliantBlue/10 transition">
                        <td className="py-2 px-3 text-brilliantBlue">{msg.name}</td>
                        <td className="py-2 px-3 text-brilliantBlue">{msg.email}</td>
                        <td className="py-2 px-3 text-brilliantBlue">{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td className="py-2 px-3 text-brilliantBlue max-w-xs truncate" title={msg.message}>{msg.message}</td>
                        <td className="py-2 px-3 text-brilliantBlue">
                          <button
                            onClick={() => setViewedMessage(msg)}
                            className="text-brilliantBlue underline text-sm mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleMessageStatusChange(msg.id, 'read')}
                            className="text-green-700 hover:text-green-900 font-bold px-2 py-1 rounded border border-green-200 bg-green-50 hover:bg-green-100 transition mr-1"
                            disabled={msg.status === 'read' || msg.status === 'responded'}
                          >
                            Mark as Read
                          </button>
                          <button
                            onClick={() => handleMessageStatusChange(msg.id, 'responded')}
                            className="text-yellow-700 hover:text-yellow-900 font-bold px-2 py-1 rounded border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition mr-1"
                            disabled={msg.status === 'responded'}
                          >
                            Mark as Responded
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
                            disabled={deletingMessageId === msg.id}
                          >
                            {deletingMessageId === msg.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="mt-8 text-center text-champagneGold text-lg">
            <Gem className="mx-auto mb-2 text-yellow-400" />
            <p>Reviews management coming soon!</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="mt-8 text-center text-champagneGold text-lg">
            <Settings className="mx-auto mb-2 text-champagneGold" />
            <p>Settings panel coming soon!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-brilliantBlue flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              Confirm Deletion
            </h3>
            <p className="text-champagneGold mb-4">Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded bg-gray-200 text-champagneGold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceModal && editingPrices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-brilliantBlue flex items-center">
              <DollarSign className="w-5 h-5 text-green-500 mr-2" />
              Edit Prices - {getDesignLabel(editingPrices.design)}
            </h3>
            <p className="text-sm text-champagneGold mb-4">
              These prices apply to all metals and shapes for this design.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-champagneGold mb-1">1.0 Carat Price</label>
                <input
                  type="number"
                  value={priceForm.price_1_0ct}
                  onChange={(e) => setPriceForm(prev => ({ ...prev, price_1_0ct: e.target.value }))}
                  className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="5000.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-champagneGold mb-1">1.5 Carat Price</label>
                <input
                  type="number"
                  value={priceForm.price_1_5ct}
                  onChange={(e) => setPriceForm(prev => ({ ...prev, price_1_5ct: e.target.value }))}
                  className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="7500.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-champagneGold mb-1">2.0 Carat Price</label>
                <input
                  type="number"
                  value={priceForm.price_2_0ct}
                  onChange={(e) => setPriceForm(prev => ({ ...prev, price_2_0ct: e.target.value }))}
                  className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10000.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-champagneGold mb-1">2.5 Carat Price</label>
                <input
                  type="number"
                  value={priceForm.price_2_5ct}
                  onChange={(e) => setPriceForm(prev => ({ ...prev, price_2_5ct: e.target.value }))}
                  className="w-full px-3 py-2 border border-brilliantBlue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="12500.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closePriceModal}
                className="px-4 py-2 rounded bg-gray-200 text-champagneGold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePriceUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Update Prices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing full message */}
      {viewedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              onClick={() => setViewedMessage(null)}
              className="absolute top-2 right-2 text-champagneGold hover:text-black text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-brilliantBlue">Message from {viewedMessage.name}</h3>
            <div className="mb-2 text-champagneGold"><strong>Email:</strong> {viewedMessage.email}</div>
            <div className="mb-2 text-champagneGold"><strong>Date:</strong> {new Date(viewedMessage.created_at).toLocaleString()}</div>
            <div className="mb-4 text-brilliantBlue whitespace-pre-line"><strong>Message:</strong><br />{viewedMessage.message}</div>
            {viewedMessage.reply ? (
              <div className="mb-4 p-3 bg-brilliantBlue/10 rounded border border-brilliantBlue/20">
                <div className="font-bold text-brilliantBlue mb-1">Your Reply:</div>
                <div className="text-champagneGold whitespace-pre-line">{viewedMessage.reply}</div>
                <div className="text-xs text-champagneGold mt-1">Sent: {viewedMessage.replied_at ? new Date(viewedMessage.replied_at).toLocaleString() : ''}</div>
              </div>
            ) : (
              <div className="mb-4">
                <textarea
                  className="w-full border border-brilliantBlue/30 rounded p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brilliantBlue/40"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  disabled={sendingReply}
                />
                <button
                  onClick={handleSendReply}
                  className="mt-2 bg-brilliantBlue text-champagneGold px-4 py-2 rounded font-bold hover:bg-champagneGold disabled:opacity-50"
                  disabled={sendingReply || !replyText.trim()}
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { handleMessageStatusChange(viewedMessage.id, 'read'); setViewedMessage(null); }}
                className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                disabled={viewedMessage.status === 'read' || viewedMessage.status === 'responded'}
              >Mark as Read</button>
              <button
                onClick={() => { handleMessageStatusChange(viewedMessage.id, 'responded'); setViewedMessage(null); }}
                className="bg-yellow-500 text-champagneGold px-4 py-2 rounded font-bold hover:bg-yellow-600"
                disabled={viewedMessage.status === 'responded'}
              >Mark as Responded</button>
              <button
                onClick={() => { handleDeleteMessage(viewedMessage.id); setViewedMessage(null); }}
                className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 