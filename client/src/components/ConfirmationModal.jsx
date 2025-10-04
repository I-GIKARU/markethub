import { CheckCircle, X, ShoppingBag } from 'lucide-react';

const ConfirmationModal = ({ 
  orderNumber, 
  onClose, 
  totalItems,
  totalPrice,
  estimatedDelivery 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="mb-6 text-gray-600">
            Your order <span className="font-semibold">#{orderNumber}</span> has been placed successfully.
          </p>

          <div className="mb-6 w-full rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
              </div>
              <span className="font-bold">KSh {totalPrice.toFixed(2)}</span>
            </div>

            {estimatedDelivery && (
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>Estimated delivery</span>
                <span>{estimatedDelivery}</span>
              </div>
            )}
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-2 font-medium text-gray-800 hover:bg-gray-50"
            >
              View Order Details
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-green-600 py-2 font-medium text-white hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            We've sent a confirmation email with your order details.
          </p>
        </div>
      </div>
    </div>
  );
};

// Default props for estimated delivery
ConfirmationModal.defaultProps = {
  estimatedDelivery: "2-3 business days",
  totalItems: 0,
  totalPrice: 0
};

export default ConfirmationModal;