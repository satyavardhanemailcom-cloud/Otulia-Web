import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
                <p className="text-gray-700 text-base mb-8">
                    {message || "Are you sure you want to proceed?"}
                </p>

                <div className="flex justify-end gap-6">
                    <button
                        onClick={onClose}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm uppercase tracking-wide"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm uppercase tracking-wide"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
