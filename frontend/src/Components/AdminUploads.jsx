"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileSpreadsheet,
  Filter,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react";

const AdminUploads = () => {
  const [uploadedData, setUploadedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("all");
  const [uploadMessage, setUploadMessage] = useState(null);

  useEffect(() => {
    fetchUploadedData();
  }, [filter]);

  const fetchUploadedData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/uploaded-data?filter=${filter}`
      );
      const data = await res.json();
      setUploadedData(data);
    } catch (error) {
      console.error("Error fetching uploaded data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setUploadMessage(null);
    } else {
      setUploadMessage({
        type: "error",
        text: "Please select a valid CSV file",
      });
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage({
        type: "error",
        text: "Please select a CSV file first",
      });
      return;
    }

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append("csvFile", selectedFile);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/upload-csv`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setUploadMessage({
          type: "success",
          text: result.message,
          errors: result.errors,
        });
        setSelectedFile(null);
        document.getElementById("csv-input").value = "";
        fetchUploadedData();
      } else {
        setUploadMessage({
          type: "error",
          text: result.error || "Failed to upload CSV",
          errors: result.errors,
        });
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadMessage({ type: "error", text: "Failed to upload CSV file" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this data?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/uploaded-data/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setUploadMessage({
          type: "success",
          text: "Data deleted successfully!",
        });
        fetchUploadedData();
      } else {
        setUploadMessage({ type: "error", text: "Failed to delete data" });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setUploadMessage({ type: "error", text: "Failed to delete data" });
    }
  };

  const downloadSampleCSV = () => {
    const csvContent =
      "fullname,phone,email\nJohn Doe,9876543210,john@example.com\nJane Smith,9876543211,jane@example.com";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_payment_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: uploadedData.length,
    processed: uploadedData.filter((d) => d.processed).length,
    unprocessed: uploadedData.filter((d) => !d.processed).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Upload Payment Data
        </h2>
        <button
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download Sample CSV
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 rounded-lg p-2 mt-1">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              CSV File Structure
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your CSV file must contain the following columns in this exact
              order:
            </p>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-blue-200">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Column Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-blue-700">
                        fullname
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Customer's full name
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      John Doe
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-blue-700">
                        phone
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      10-digit phone number
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      9876543210
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-blue-700">
                        email
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Valid email address
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      john@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 font-medium">
                Important Notes:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                <li>First row must be the header row with column names</li>
                <li>All fields are required for each row</li>
                <li>Phone numbers must be exactly 10 digits</li>
                <li>Email must be in valid format (e.g., user@domain.com)</li>
                <li>
                  Users will enter the payment amount manually in the form
                </li>
              </ul>
            </div>

            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-semibold mb-2">
                Example CSV Content:
              </p>
              <pre className="bg-white border border-green-300 rounded p-3 text-xs font-mono text-gray-800 overflow-x-auto">
                {`fullname,phone,email
John Doe,9876543210,john@example.com
Jane Smith,9876543211,jane@example.com
Bob Johnson,9876543212,bob@example.com`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Entries</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileSpreadsheet className="w-12 h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Processed</p>
              <p className="text-3xl font-bold mt-1">{stats.processed}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.unprocessed}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dashed border-gray-300">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-16 h-16 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload CSV File
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV file with columns: fullname, phone, email
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input
              id="csv-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </>
              )}
            </button>
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
              Selected:{" "}
              <span className="font-semibold">{selectedFile.name}</span>
            </div>
          )}
        </div>

        {uploadMessage && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              uploadMessage.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`font-semibold ${
                uploadMessage.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {uploadMessage.text}
            </p>
            {uploadMessage.errors && uploadMessage.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-red-700 font-medium">
                  Errors found:
                </p>
                <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                  {uploadMessage.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {uploadMessage.errors.length > 5 && (
                    <li className="text-red-500">
                      ...and {uploadMessage.errors.length - 5} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Uploaded Data</h3>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("unprocessed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "unprocessed"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending ({stats.unprocessed})
              </button>
              <button
                onClick={() => setFilter("processed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "processed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Processed ({stats.processed})
              </button>
            </div>
            <button
              onClick={fetchUploadedData}
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {uploadedData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No data found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {filter === "all"
                          ? "Upload a CSV file to get started"
                          : `No ${filter} entries available`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  uploadedData.map((data) => (
                    <tr key={data._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {data.fullname}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {data.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {data.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            data.processed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {data.processed ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Processed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(data.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(data._id)}
                          className="text-red-600 hover:text-red-800 transition flex items-center gap-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUploads;
