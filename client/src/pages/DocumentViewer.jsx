import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiDownload, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

const DocumentViewer = () => {
    const location = useLocation();
    
   const [searchParams] = useSearchParams();
    
    const docUrl = searchParams.get('url');
    const docName = searchParams.get('name');

    // Console log the URL as requested
    console.log('Received document URL:', docUrl);

    const [pdfBlobUrl, setPdfBlobUrl] = useState(null); // This state will now directly hold docUrl for PDFs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isPdf = docUrl?.toLowerCase().endsWith('.pdf');

    useEffect(() => {
        if (!docUrl) {
            setError('No document URL provided.');
            setLoading(false);
            return;
        }

        if (isPdf) {
            setLoading(false); // No fetching needed, so no loading state after initial check
            setError('');
            // Directly use docUrl for iframe src, assuming browser can handle it
            // Note: This approach might encounter CORS issues depending on server configuration.
            setPdfBlobUrl(docUrl); 
        } else {
            // For images, no fetching needed, just stop loading
            setLoading(false);
        }

        // Cleanup function is no longer needed as we don't create object URLs for PDFs
        return () => {}; 
    }, [docUrl, isPdf]);


    if (!docUrl || error && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'No document URL provided.'}</h2>
                <p className="text-gray-500 mb-8">Please return to the dashboard and try again.</p>
                <Link to="/admin" className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-[#D48D2A] transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    // Function to trigger download - still uses fetch and blob for robustness
    const handleDownload = async () => {
        try {
            const response = await fetch(docUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // Sanitize file name
            const fileName = docName.replace(/[^a-z0-9_.-]/gi, '_');
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Could not download the file.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col montserrat">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                    
                    
                        <span className="text-sm font-semibold text-gray-800 hidden md:block truncate max-w-xs" title={docName}>
                            {docName}
                        </span>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#D48D2A] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#B5751C] shadow-md shadow-[#D48D2A]/20 transition-all"
                        >
                            <FiDownload className="w-4 h-4" />
                            <span>Download</span>
                        </button>
                    
                </div>
            </header>

            <main className="flex-1 flex flex-col p-4 sm:p-8">
                <div className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center">
                    {loading ? (
                        <div className="text-center text-gray-500">
                            <FiLoader className="animate-spin text-4xl mx-auto mb-4" />
                            <p className="font-semibold">Loading Document...</p>
                        </div>
                    ) : (
                        <iframe
                            src={docUrl} // Directly use docUrl
                            title={docName}
                            className="w-full h-full rounded-2xl border-4 border-white shadow-2xl"
                            style={{ minHeight: '80vh' }}
                        />
                    ) }
                </div>
            </main>
        </div>
    );
};

export default DocumentViewer;
