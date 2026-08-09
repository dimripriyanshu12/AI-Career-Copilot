import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get(`/resume/${id}`);
        setResume(response.data.resume);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load resume"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">
          Loading analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
          {error}
        </div>
      </div>
    );
  }

  const analysis = resume.aiAnalysis;
  const score = analysis?.score ?? 0;

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
        <button
          onClick={() => navigate("/resumes")}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← My Resumes
        </button>

        <h1 className="ml-6 font-bold text-slate-900">
          Resume Analysis
        </h1>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        {/* Resume Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Resume report
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            {resume.fileName}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Analyzed on{" "}
            {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-6">

          <div className="flex flex-col md:flex-row gap-8 items-center">

            <div className="w-40 h-40 rounded-full border-width: 10px; border-slate-900 flex items-center justify-center">

              <div className="text-center">
                <p className="text-5xl font-bold text-slate-900">
                  {score}
                </p>

                <p className="text-sm text-slate-400">
                  / 100
                </p>
              </div>

            </div>

            <div>
              <p className="text-sm text-slate-500">
                Overall Resume Score
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {score >= 80
                  ? "Excellent Profile"
                  : score >= 60
                  ? "Good Profile"
                  : "Needs Improvement"}
              </h3>

              <p className="text-slate-600 mt-3 max-w-2xl">
                {analysis?.summary}
              </p>
            </div>

          </div>

        </div>

        {/* Skills */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h3 className="text-lg font-bold text-slate-900">
              Strong Skills
            </h3>

            <div className="flex flex-wrap gap-2 mt-5">

              {analysis?.strongSkills?.map(
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
              Skills to Improve
            </h3>

            <div className="flex flex-wrap gap-2 mt-5">

              {analysis?.missingSkills?.map(
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

        {/* Improvements */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

          <h3 className="text-lg font-bold text-slate-900">
            AI Improvement Plan
          </h3>

          <div className="mt-5 space-y-4">

            {analysis?.improvements?.map(
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

        {/* Career Suggestions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h3 className="text-lg font-bold text-slate-900">
            Recommended Career Paths
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">

            {analysis?.careerSuggestions?.map(
              (role, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-sm"
                >

                  <p className="font-semibold text-slate-900">
                    {role}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    Recommended by AI
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default ResumeDetail;