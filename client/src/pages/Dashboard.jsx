import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get("/resume");
        setResumes(response.data.resumes || []);
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const resumeCount = resumes.length;

  const latestResume = resumes[0];

  const latestScore = latestResume?.aiAnalysis?.score ?? "—";

  const careerMatchCount =
    latestResume?.aiAnalysis?.careerSuggestions?.length ?? 0;

  const getScoreText = () => {
    if (latestScore === "—") {
      return "Upload a resume to analyze";
    }

    if (latestScore >= 80) {
      return "Excellent resume score";
    }

    if (latestScore >= 60) {
      return "Good foundation";
    }

    return "Needs improvement";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= NAVBAR ================= */}

      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        {/* Logo */}

        <button
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-slate-900"
        >
          AI Career Copilot
        </button>

        {/* User Menu */}

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {user.name || "User"}
            </span>

            <span className="text-xs text-slate-400">▼</span>
          </button>

          {/* Dropdown */}

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.name || "User"}
                </p>

                <p className="text-xs text-slate-400 truncate mt-1">
                  {user.email || ""}
                </p>
              </div>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="flex">
        {/* ================= SIDEBAR ================= */}

        <aside className="hidden md:block w-60 min-h-[calc(100vh-64px)] bg-slate-950 text-white p-4">
          <div className="mb-8 px-4 pt-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Workspace
            </p>
          </div>

          <nav className="space-y-2">
            {/* Dashboard */}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg bg-white/10 text-white"
            >
              <span>▦</span>
              <span>Dashboard</span>
            </button>

            {/* My Resumes */}

            <button
              onClick={() => navigate("/resumes")}
              className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <span>▤</span>
              <span>My Resumes</span>
            </button>

            {/* Analyzer */}

            <button
              onClick={() => navigate("/analyzer")}
              className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <span>✦</span>
              <span>Resume Analyzer</span>
            </button>

            <button
              onClick={() => navigate("/job-matcher")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
            >
              Job Matcher
            </button>
            <button
              onClick={() => navigate("/resume-builder")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
            >
              AI Resume Builder
            </button>
          </nav>

          {/* Sidebar bottom */}

          <div className="absolute bottom-6 px-4">
            <p className="text-xs text-slate-500">AI Career Copilot</p>

            <p className="text-xs text-slate-600 mt-1">
              Career Intelligence Platform
            </p>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* ================= WELCOME ================= */}

            <div className="mb-8">
              <p className="text-sm text-slate-500">Your career workspace</p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
                Welcome back, {user.name?.split(" ")[0] || "there"} 👋
              </h1>

              <p className="text-slate-500 mt-2">
                Analyze your resume and improve your chances of getting hired.
              </p>
            </div>

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {/* Resume Score */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Latest Resume Score
                    </p>

                    <p className="text-4xl font-bold text-slate-900 mt-2">
                      {latestScore}
                      {latestScore !== "—" && (
                        <span className="text-lg text-slate-400">/100</span>
                      )}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    ★
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">{getScoreText()}</p>
              </div>

              {/* Resume Count */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Resumes Analyzed</p>

                    <p className="text-4xl font-bold text-slate-900 mt-2">
                      {loading ? "..." : resumeCount}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    ▤
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Total resume analyses
                </p>
              </div>

              {/* Career Matches */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Career Matches</p>

                    <p className="text-4xl font-bold text-slate-900 mt-2">
                      {latestScore === "—" ? "—" : careerMatchCount}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    ✦
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  AI recommended career roles
                </p>
              </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Analyzer */}

              <div className="lg:col-span-2 bg-slate-950 text-white rounded-2xl p-8">
                <div className="max-w-xl">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-5">
                    ✦
                  </div>

                  <p className="text-sm text-slate-400">
                    AI-powered career analysis
                  </p>

                  <h2 className="text-2xl md:text-3xl font-bold mt-1">
                    Make your resume stronger
                  </h2>

                  <p className="text-slate-400 mt-3 leading-relaxed">
                    Upload your resume and let AI identify your strengths,
                    missing skills, career opportunities and areas for
                    improvement.
                  </p>

                  <button
                    onClick={() => navigate("/analyzer")}
                    className="mt-6 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
                  >
                    Analyze Resume →
                  </button>
                </div>
              </div>

              {/* Latest Resume */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <p className="text-sm text-slate-500">Latest Resume</p>

                {latestResume ? (
                  <>
                    <h3 className="font-bold text-slate-900 mt-3 wrap-break-word">
                      {latestResume.fileName}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(latestResume.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Score</p>

                        <p className="text-2xl font-bold text-slate-900">
                          {latestResume.aiAnalysis?.score ?? "—"}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/resume/${latestResume._id}`)}
                        className="text-sm font-semibold text-slate-900 hover:underline"
                      >
                        View →
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-5">
                      <p className="text-sm text-slate-500">
                        No resume uploaded yet.
                      </p>

                      <button
                        onClick={() => navigate("/analyzer")}
                        className="mt-4 text-sm font-semibold text-slate-900 hover:underline"
                      >
                        Upload your first resume →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ================= RECENT RESUMES ================= */}

            <div className="bg-white border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div>
                  <h2 className="font-bold text-lg text-slate-900">
                    Recent Resumes
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Your latest AI resume analyses
                  </p>
                </div>

                {resumes.length > 0 && (
                  <button
                    onClick={() => navigate("/resumes")}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    View all
                  </button>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-400">
                  Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    ▤
                  </div>

                  <h3 className="font-semibold text-slate-900 mt-4">
                    No resumes yet
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Upload your first resume to get an AI analysis.
                  </p>

                  <button
                    onClick={() => navigate("/analyzer")}
                    className="mt-5 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800"
                  >
                    Analyze Resume
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {resumes.slice(0, 5).map((resume) => (
                    <div
                      key={resume._id}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {resume.fileName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Score</p>

                          <p className="font-bold text-slate-900">
                            {resume.aiAnalysis?.score ?? "—"}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/resume/${resume._id}`)}
                          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
