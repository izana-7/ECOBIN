import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info,
  Layers,
  MapPin
} from 'lucide-react';

export default function AIScannerPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [userConfirmedCategory, setUserConfirmedCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Plastic', 'Paper', 'Organic/Food', 'Glass', 'Metal', 'E-waste', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileObject(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    setError('');
    setScanning(true);

    try {
      // Send image to AI computer vision detection service
      const res = await api.post('/ai/detect-waste', {
        image: imagePreview,
        filename: fileObject ? fileObject.name : 'scanned_waste.jpg'
      });

      setScanResult(res.data);
      setUserConfirmedCategory(res.data.category);
    } catch (err) {
      setError(err.response?.data?.message || 'Error running AI waste detection scan.');
    } finally {
      setScanning(false);
    }
  };

  const proceedToReport = () => {
    if (!scanResult) return;
    navigate('/report', {
      state: {
        prefilledType: userConfirmedCategory || scanResult.category,
        prefilledImage: scanResult.imageUrl || imagePreview,
        prefilledDescription: `AI Detected Item: ${scanResult.detectedItem} (${scanResult.confidence}% confidence). Recommended bin: ${scanResult.recommendedBin}.`,
        aiDetectedType: scanResult.category,
        aiConfidence: scanResult.confidence
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-eco-400 bg-eco-500/10 px-3.5 py-1.5 rounded-full border border-eco-500/20 mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Computer Vision Scanner Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI Waste Scanner</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Upload or snap a photo of waste. Our computer vision model identifies the material, confidence level, and recommended campus bin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Image Upload & Frame */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          
          <div className="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-dashed border-slate-800 bg-slate-900/80 flex flex-col items-center justify-center text-center p-4">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Scanned Waste" className="w-full h-full object-cover rounded-xl" />
                {scanning && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-full h-1 bg-eco-500 shadow-lg shadow-eco-500 animate-scan absolute" />
                    <RefreshCw className="w-10 h-10 text-eco-400 animate-spin mb-3" />
                    <span className="text-xs font-extrabold text-white tracking-widest uppercase">Analyzing Image Features...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-eco-500/10 text-eco-400 flex items-center justify-center mx-auto">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-xs text-slate-300 font-bold">Upload or Take Waste Photo</div>
                <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP files</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <label className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Camera className="w-4 h-4 text-eco-400" /> Choose Photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {imagePreview && (
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex-1 py-3 px-4 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-eco-500/20 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4" /> {scanning ? 'Analyzing...' : 'Scan with AI'}
              </button>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
              {error}
            </div>
          )}

        </div>

        {/* Right Column: AI Detection Results */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-eco-400" /> Scan Results
            </h3>
            {scanResult && (
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                scanResult.isMock
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-eco-500/10 text-eco-400 border-eco-500/30'
              }`}>
                {scanResult.isMock ? 'Demo / Mock Model Active' : 'Live Vision Model'}
              </span>
            )}
          </div>

          {!scanResult ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>Select an image and click <strong>"Scan with AI"</strong> to see computer vision classification & recommended bin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Detected Item & Confidence */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Detected Object</span>
                  <span className="text-xs font-bold text-eco-400 bg-eco-500/10 px-2 py-0.5 rounded border border-eco-500/20">
                    {scanResult.confidence}% Confidence
                  </span>
                </div>
                <div className="text-lg font-extrabold text-white">{scanResult.detectedItem}</div>
              </div>

              {/* Detected Category & Recommended Bin */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">AI Category</span>
                  <span className="font-bold text-white text-sm">{scanResult.category}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">Recommended Bin</span>
                  <span className="font-bold text-eco-400 text-sm">{scanResult.recommendedBin}</span>
                </div>
              </div>

              {/* Category Correction Option */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-300">
                  Confirm or Correct Waste Category:
                </label>
                <select
                  value={userConfirmedCategory}
                  onChange={(e) => setUserConfirmedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-eco-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={proceedToReport}
                className="w-full py-3.5 rounded-2xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-eco-500/20 transition-all mt-4"
              >
                Proceed to Report Waste with AI Data <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
