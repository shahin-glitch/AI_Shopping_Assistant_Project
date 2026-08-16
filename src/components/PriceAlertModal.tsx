import React, { useState } from "react";
import { Bell, Check, X } from "lucide-react";

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentPrice: string;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  productName,
  currentPrice,
}) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div
        id="price-alert-dialog"
        className="bg-white border-2 border-black max-w-md w-full p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-black" />
            <h3 className="font-bold text-base uppercase tracking-tight text-black">
              Set Price Drop Alert
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-black text-sm uppercase">
              Price Alert Configured!
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              We will notify {email} when {productName} drops below your target price.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                Product
              </label>
              <div className="text-xs font-semibold text-black p-2 bg-neutral-50 border border-black/20">
                {productName} (Current: {currentPrice})
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                Target Alert Price
              </label>
              <input
                type="text"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 10% below current price"
                className="w-full text-xs p-2 border border-black outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1">
                Notification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-xs p-2 border border-black outline-none font-mono"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-mono border border-black/20 hover:border-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-xs font-mono hover:bg-neutral-800"
              >
                Activate Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
