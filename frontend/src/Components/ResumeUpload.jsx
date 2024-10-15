import React, { useState } from 'react';

export function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const email = localStorage.getItem("email"); // Get email from local storage

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a PDF file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('email', email); 

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('PDF uploaded successfully!');
      } else {
        setUploadStatus('Error uploading PDF.');
      }
    } catch (err) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
          required
        />
        <br /><br />
        <button type="submit">Upload PDF</button>
      </form>

      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
