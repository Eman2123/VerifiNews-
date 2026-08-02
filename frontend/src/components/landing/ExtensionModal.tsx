'use client';
import { useState } from 'react';
import { MdClose, MdCheckCircle, MdExtension } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExtensionModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl dark:bg-navy-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <MdClose className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <MdExtension className="h-8 w-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">
                Add VerifiNews to Chrome
              </h2>
            </div>

            {/* Step 1: Installation Instructions */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Download Extension
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Click the button below to download the extension files
                      </p>
                      <button
                        onClick={() => {
                          // Create and trigger download
                          const link = document.createElement('a');
                          link.href = '/extension-download';
                          link.download = 'verifinews-extension.zip';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="inline-block rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 transition"
                      >
                        Download Extension
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Extract Files
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Extract the downloaded zip file to any folder on your computer
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Open Chrome Extensions
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Open this URL in your Chrome browser:
                      </p>
                      <code className="block bg-gray-100 dark:bg-navy-800 p-2 rounded text-sm text-gray-700 dark:text-gray-300 break-all mb-2">
                        chrome://extensions
                      </code>
                      <button
                        onClick={() => {
                          window.open('chrome://extensions', '_blank');
                        }}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                      >
                        Open chrome://extensions →
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                        4
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Enable Developer Mode
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Toggle the <strong>"Developer mode"</strong> switch in the top-right corner
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white font-bold">
                        5
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Load Unpacked
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Click <strong>"Load unpacked"</strong> and select the extracted extension folder
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ⚠️ Select the folder containing <code>manifest.json</code>, not the file itself
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                        <MdCheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                        Done! Start Using
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        The VerifiNews extension is now installed. Click the extension icon on any news page to check articles!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-navy-700">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-navy-700 px-4 py-2 font-semibold text-navy-900 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-800 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.open('chrome://extensions', '_blank');
                    }}
                    className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 transition"
                  >
                    Open Chrome Extensions
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}