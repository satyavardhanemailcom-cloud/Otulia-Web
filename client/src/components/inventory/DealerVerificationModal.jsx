import React, { useState } from 'react';
import { FiX, FiUpload, FiCheckCircle, FiAlertCircle, FiFileText } from 'react-icons/fi';

const DealerVerificationModal = ({ isOpen, onClose, onSubmit }) => {
    const [documents, setDocuments] = useState({
        businessLicense: null,
        taxId: null,
        proofOfAddress: null,
        dealershipCertificate: null,
        insuranceProof: null
    });

    const [uploadedFiles, setUploadedFiles] = useState({
        businessLicense: null,
        taxId: null,
        proofOfAddress: null,
        dealershipCertificate: null,
        insuranceProof: null
    });

    const handleFileChange = (documentType, file) => {
        if (file) {
            setDocuments(prev => ({ ...prev, [documentType]: file }));
            setUploadedFiles(prev => ({ ...prev, [documentType]: file.name }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if at least the required documents are uploaded
        const requiredDocs = ['businessLicense', 'taxId', 'proofOfAddress'];
        const allRequiredUploaded = requiredDocs.every(doc => documents[doc] !== null);

        if (!allRequiredUploaded) {
            alert('Please upload all required documents (Business License, Tax ID, and Proof of Address)');
            return;
        }

        // Submit the documents
        onSubmit(documents);
    };

    if (!isOpen) return null;

    const documentFields = [
        {
            id: 'businessLicense',
            label: 'Business License',
            description: 'Valid business registration or license document',
            required: true,
            icon: <FiFileText />
        },
        {
            id: 'taxId',
            label: 'Tax ID / EIN',
            description: 'Tax identification or employer identification number',
            required: true,
            icon: <FiFileText />
        },
        {
            id: 'proofOfAddress',
            label: 'Proof of Business Address',
            description: 'Utility bill, lease agreement, or property deed',
            required: true,
            icon: <FiFileText />
        },
        {
            id: 'dealershipCertificate',
            label: 'Dealership Certificate',
            description: 'Any auto/yacht dealership certification (if applicable)',
            required: false,
            icon: <FiFileText />
        },
        {
            id: 'insuranceProof',
            label: 'Insurance Proof',
            description: 'Business liability insurance documentation',
            required: false,
            icon: <FiFileText />
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-1">Dealer Verification</h2>
                        <p className="text-sm text-gray-400 font-medium">Upload required documents to verify your dealership</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-10 py-8 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex gap-4">
                        <FiAlertCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Verification Requirements</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                All documents must be clear, valid, and match your company information.
                                Verification typically takes 2-3 business days. You'll receive an email upon completion.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {documentFields.map((field) => (
                            <div key={field.id} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                            {field.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-gray-900">{field.label}</h4>
                                                {field.required && (
                                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                                                        Required
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400">{field.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Area */}
                                <label className="block">
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(field.id, e.target.files[0])}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                    />
                                    <div className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all hover:border-[#D48D2A] hover:bg-white group ${uploadedFiles[field.id]
                                            ? 'border-emerald-300 bg-emerald-50'
                                            : 'border-gray-200 bg-white'
                                        }`}>
                                        {uploadedFiles[field.id] ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                                    <FiCheckCircle className="text-lg" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{uploadedFiles[field.id]}</p>
                                                    <p className="text-xs text-gray-400">Click to replace</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#D48D2A]">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#FDF8F0] transition-colors">
                                                    <FiUpload className="text-lg" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">Click to upload</p>
                                                    <p className="text-xs">PDF, JPG, PNG (Max 10MB)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-8 py-4 bg-[#D48D2A] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#D48D2A]/20 hover:bg-[#B5751C] transition-all"
                            >
                                Submit for Verification
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}} />
        </div>
    );
};

export default DealerVerificationModal;
