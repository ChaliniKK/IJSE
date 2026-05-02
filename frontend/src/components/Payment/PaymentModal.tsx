import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, CheckCircle, Loader2, X } from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, orderId, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'WALLET'>('CARD');
  const [step, setStep] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS'>('INPUT');

  const handlePayment = async () => {
    setLoading(true);
    setStep('PROCESSING');
    try {
      // 1. Initiate Payment
      const initResponse = await axiosInstance.post(`/payments/initiate/${orderId}`, {
        paymentMethod
      });
      
      const paymentId = initResponse.data.id;

      // 2. Mock Delay to simulate gateway
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Confirm Payment
      await axiosInstance.put(`/payments/${paymentId}/confirm`);
      
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setStep('INPUT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={step === 'INPUT' ? onClose : undefined}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {step === 'INPUT' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payment Details</h2>
                  <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8">
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
                    <span>Order Amount</span>
                    <span>Order ID: #{orderId}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${amount.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Payment Method</p>
                  
                  <button 
                    onClick={() => setPaymentMethod('CARD')}
                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'CARD' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                    }`}
                  >
                    <CreditCard className="mr-4" />
                    <div className="text-left">
                      <div className="font-bold">Credit / Debit Card</div>
                      <div className="text-xs opacity-70">Pay securely with your card</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'WALLET' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                    }`}
                  >
                    <Wallet className="mr-4" />
                    <div className="text-left">
                      <div className="font-bold">Digital Wallet</div>
                      <div className="text-xs opacity-70">Instantly pay with your wallet</div>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Pay Now</span>
                </button>
              </div>
            )}

            {step === 'PROCESSING' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
                  <Loader2 className="absolute inset-0 m-auto text-primary animate-spin" size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Processing Payment</h3>
                <p className="text-slate-500 dark:text-slate-400">Please do not close this window or refresh the page.</p>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/30"
                >
                  <CheckCircle className="text-white" size={48} />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-slate-500 dark:text-slate-400">Your order has been placed and confirmed.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
