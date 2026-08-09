import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get("/resume");

        setResumes(response.data.resumes);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load resumes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Dashboard
        </button>

        <h1 className="ml-6 font-bold text-slate-900">
          My Resumes
        </h1>

      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        <div className="flex items-center justify-between mb-8">

          <div>
            <p className="text-sm text-slate-500">
              Resume history
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              My Resumes
            </h2>
          </div>

          <button
            onClick={() => navigate("/analyzer")}
            className="bg-slate-900 text-white px-5 py-3 rounded-lg font-semibold hover:bg-slate-800"
          >
            + Analyze Resume
          </button>

        </div>

        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            Loading resumes...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {!loading && !error && resumes.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

            <h3 className="text-xl font-bold text-slate-900">
              No resumes yet
            </h3>

            <p className="text-slate-500 mt-2">
              Upload your first resume to get an AI analysis.
            </p>

            <button
              onClick={() => navigate("/analyzer")}
              className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Analyze Resume
            </button>

          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5">

            {resumes.map((resume) => {

              const score =
                resume.aiAnalysis?.score ?? "—";

              return (
                <div
                  key={resume._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {resume.fileName}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {new Date(
                          resume.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">

                      <span className="font-bold text-slate-900">
                        {score}
                      </span>

                    </div>

                  </div>

                  <p className="text-sm text-slate-600 mt-5 line-clamp-2">
                    {resume.aiAnalysis?.summary ||
                      "No analysis available"}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/resume/${resume._id}`)
                    }
                    className="mt-5 w-full border border-slate-300 rounded-lg py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View Analysis
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyResumes;