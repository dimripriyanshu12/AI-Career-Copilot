import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function JobMatcher() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get("/resume");

        setResumes(response.data.resumes);

        if (response.data.resumes.length > 0) {
          setResumeId(response.data.resumes[0]._id);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load resumes"
        );
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!resumeId) {
      setError("Please select a resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/job-match", {
        resumeId,
        jobTitle,
        jobDescription,
      });

      setResult(response.data.jobMatch.matchAnalysis);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Job matching failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Dashboard
        </button>

        <h1 className="ml-6 font-bold text-slate-900">
          Job Matcher
        </h1>

      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        {/* Page heading */}
        <div className="mb-8">

          <p className="text-sm text-slate-500">
            AI-powered job matching
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            How well does your resume match?
          </h2>

          <p className="text-slate-500 mt-2">
            Compare your resume with a job description and discover
            exactly what you should improve.
          </p>

        </div>

        {!result && (
          <form
            onSubmit={handleAnalyze}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8"
          >

            {/* Resume */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Resume
              </label>

              {loadingResumes ? (
                <p className="text-sm text-slate-400">
                  Loading resumes...
                </p>
              ) : resumes.length === 0 ? (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    You don't have any analyzed resumes yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/analyzer")}
                    className="mt-3 text-sm font-semibold text-slate-900 underline"
                  >
                    Analyze a resume first
                  </button>
                </div>
              ) : (
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
                >
                  {resumes.map((resume) => (
                    <option
                      key={resume._id}
                      value={resume._id}
                    >
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              )}

            </div>

            {/* Job title */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Title
              </label>

              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />

            </div>

            {/* Job description */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Description
              </label>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste the complete job description here..."
                rows={12}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900 resize-y"
              />

              <p className="text-xs text-slate-400 mt-2">
                Include responsibilities, required skills and
                qualifications for better results.
              </p>

            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || resumes.length === 0}
              className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "AI is comparing your resume..."
                : "Analyze Job Match"}
            </button>

          </form>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-6">

            {/* Match score */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">

              <div className="flex flex-col md:flex-row items-center gap-8">

                <div className="w-40 h-40 rounded-full border-width: 10px border-slate-900 flex items-center justify-center">

                  <div className="text-center">
                    <p className="text-5xl font-bold text-slate-900">
                      {result.matchScore}
                    </p>

                    <p className="text-sm text-slate-400">
                      / 100
                    </p>
                  </div>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Job Match Score
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {result.matchScore >= 80
                      ? "Excellent Match"
                      : result.matchScore >= 60
                      ? "Good Match"
                      : "Needs Improvement"}
                  </h3>

                  <p className="text-slate-600 mt-3 max-w-2xl">
                    {result.summary}
                  </p>

                </div>

              </div>

            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Matching Skills
                </h3>

                <div className="flex flex-wrap gap-2 mt-5">

                  {result.matchingSkills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2 mt-5">

                  {result.missingSkills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* Experience */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-lg font-bold text-slate-900">
                Experience Match
              </h3>

              <p className="text-slate-600 mt-3">
                {result.experienceMatch}
              </p>

            </div>

            {/* Recommendations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-lg font-bold text-slate-900">
                AI Recommendations
              </h3>

              <div className="space-y-4 mt-5">

                {result.recommendations?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-4"
                    >

                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {index + 1}
                      </div>

                      <p className="text-slate-600 pt-1">
                        {item}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* Interview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-lg font-bold text-slate-900">
                Interview Preparation
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">

                {result.interviewTopics?.map(
                  (topic, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {topic}
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>

            <button
              onClick={() => {
                setResult(null);
                setJobDescription("");
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
            >
              Analyze Another Job
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default JobMatcher;