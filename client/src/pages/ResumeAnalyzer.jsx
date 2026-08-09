import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setError("");
    setResult(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const response = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.resume);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Resume analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const score = result?.aiAnalysis?.score || 0;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Dashboard
        </button>

        <h1 className="ml-6 font-bold text-slate-900">
          Resume Analyzer
        </h1>

      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        {/* Header */}
        <div className="mb-8">

          <p className="text-sm text-slate-500">
            AI-powered resume review
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Analyze your resume
          </h2>

          <p className="text-slate-500 mt-2">
            Get an AI-powered score, skill analysis and personalized
            recommendations.
          </p>

        </div>

        {/* Upload Card */}
        {!result && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8">

            <div className="max-w-xl mx-auto text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl">
                ↑
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Upload your resume
              </h3>

              <p className="text-slate-500 mt-2">
                Upload your latest PDF resume and our AI will analyze it.
              </p>

              <label className="block mt-6 cursor-pointer">

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-slate-500 transition">

                  {file ? (
                    <>
                      <p className="font-semibold text-slate-900">
                        {file.name}
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-700">
                        Click to choose a PDF
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Maximum file size: 5 MB
                      </p>
                    </>
                  )}

                </div>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "AI is analyzing your resume..."
                  : "Analyze Resume"}
              </button>

            </div>

          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">

              <div className="flex flex-col md:flex-row md:items-center gap-8">

                <div className="w-36 h-36 rounded-full border-8 border-slate-900 flex items-center justify-center shrink-0">

                  <div className="text-center">
                    <p className="text-4xl font-bold text-slate-900">
                      {score}
                    </p>

                    <p className="text-xs text-slate-500">
                      / 100
                    </p>
                  </div>

                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Resume Score
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {score >= 80
                      ? "Strong Resume"
                      : score >= 60
                      ? "Good Foundation"
                      : "Needs Improvement"}
                  </h3>

                  <p className="text-slate-600 mt-3 max-w-2xl">
                    {result.aiAnalysis.summary}
                  </p>
                </div>

              </div>

            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Strong Skills */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <h3 className="font-bold text-lg text-slate-900">
                  Strong Skills
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">

                  {result.aiAnalysis.strongSkills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* Missing Skills */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <h3 className="font-bold text-lg text-slate-900">
                  Recommended Skills
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">

                  {result.aiAnalysis.missingSkills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* Improvements */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-lg font-bold text-slate-900">
                Improvement Suggestions
              </h3>

              <div className="mt-4 space-y-3">

                {result.aiAnalysis.improvements?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <span className="font-bold text-slate-900">
                        {index + 1}.
                      </span>

                      <p className="text-slate-600">
                        {item}
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>

            {/* Career Suggestions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-lg font-bold text-slate-900">
                Recommended Career Roles
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">

                {result.aiAnalysis.careerSuggestions?.map(
                  (role, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {role}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        AI recommendation
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>

            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
            >
              Analyze Another Resume
            </button>

          </div>
        )}

      </main>

    </div>
  );
}

export default ResumeAnalyzer;