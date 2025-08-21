import React, { useState } from 'react';
import Layout from '../components/Layout';

const DocumentEsign: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      console.log('File selected:', file.name);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log('Submitting file:', selectedFile.name);
      // Implement file submission logic here
      alert('File submitted successfully!');
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">
                  <i className="ri-file-sign-line me-2"></i>
                  Document E-Signature
                </h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">
                    Select Document
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      id="fileInput"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      Browse
                    </button>
                  </div>
                  {fileName && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Selected file: {fileName}
                      </small>
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                  >
                    <i className="ri-send-plane-line me-2"></i>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentEsign;
