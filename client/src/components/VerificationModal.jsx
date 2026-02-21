import React, { useState } from 'react';
import { FiUploadCloud, FiX, FiCheck, FiFile } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const VerificationModal = ({ onClose, onUploadSuccess }) => {
    const { token } = useAuth();
    const [files, setFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const documentTypes = [
        { id: 'identityDocument', label: 'Identity Proof (Passport/ID)', required: true },
        { id: 'businessLicense', label: 'Business License', required: true },
        { id: 'taxDocument', label: 'Tax Registration', required: false },
    ];

    const handleFileChange = (e, typeId) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({
                ...prev,
                [typeId]: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        const missingRequired = documentTypes
            .filter(t => t.required && !files[t.id]);

        if (missingRequired.length > 0) {
            setError(`Please upload: ${missingRequired.map(t => t.label).join(', ')}`);
            return;
        }

        setUploading(true);
        const formData = new FormData();

        Object.entries(files).forEach(([key, file]) => {
            formData.append(key, file);
        });

        try {
            const response = await fetch('/api/auth/submit-verification', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onUploadSuccess(updatedUser);
            } else {
                const data = await response.json();
                setError(data.error || 'Upload failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-playfair text-gray-900">Partner Verification</h3>
                        <p className="text-sm text-gray-500 mt-1">Submit documents to unlock seller privileges</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <FiX className="text-xl text-gray-500" />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {documentTypes.map((doc) => (
                            <div key={doc.id} className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    {doc.label} {doc.required && <span className="text-red-500">*</span>}
                                </label>
                                <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${files[doc.id] ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-[#D48D2A] hover:bg-[#FDF8F0]'}`}>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, doc.id)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${files[doc.id] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-[#F2E8DB] group-hover:text-[#D48D2A]'}`}>
                                            {files[doc.id] ? <FiCheck /> : <FiUploadCloud />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {files[doc.id] ? (
                                                <>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{files[doc.id].name}</p>
                                                    <p className="text-xs text-green-600 font-medium">Ready to upload</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-gray-600">Click to upload file</p>
                                                    <p className="text-xs text-gray-400">PDF, JPG, or PNG (Max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 py-4 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#D48D2A] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : 'Submit Documents'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
