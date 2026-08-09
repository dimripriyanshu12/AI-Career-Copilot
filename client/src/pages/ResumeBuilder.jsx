import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ResumeBuilder() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "",
    skills: "",
    experience: "",
    projects: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post(
        "/resume-builder",
        form
      );

      setResult(response.data.content);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to generate resume content."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadPDF = async () => {
  try {
    const response = await api.post(
      "/resume-builder/pdf",
      {
        name: form.name,
        role: form.role,
        professionalSummary:
          result.professionalSummary,
        technicalSkills:
          result.technicalSkills,
        experience:
          result.experience,
        projects:
          result.projects,
      },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${form.name || "resume"}-resume.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(
      "PDF download failed:",
      error
    );

    setError("Failed to generate PDF.");
  }
};

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
          AI Resume Builder
        </h1>

      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">

        <div className="mb-8">

          <p className="text-sm text-slate-500">
            AI-powered resume writing
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            Build better resume content
          </h2>

          <p className="text-slate-500 mt-2">
            Provide your real experience and let AI turn it into
            professional, ATS-friendly content.
          </p>

        </div>

        {!result && (
          <form
            onSubmit={handleGenerate}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Target Role
                </label>

                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>

            </div>

            <div className="mt-6">

              <label className="block text-sm font-semibold mb-2">
                Technical Skills
              </label>

              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Express, MongoDB, JavaScript..."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />

            </div>

            <div className="mt-6">

              <label className="block text-sm font-semibold mb-2">
                Experience
              </label>

              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Describe your actual work experience, internships or freelance work..."
                rows={5}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />

            </div>

            <div className="mt-6">

              <label className="block text-sm font-semibold mb-2">
                Projects
              </label>

              <textarea
                name="projects"
                value={form.projects}
                onChange={handleChange}
                placeholder="Describe your projects and what you built..."
                rows={5}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />

            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading
                ? "AI is writing your resume..."
                : "Generate Resume Content"}
            </button>

          </form>
        )}

        {result && (
          <div className="space-y-6">

            <section className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-xl font-bold text-slate-900">
                Professional Summary
              </h3>

              <p className="text-slate-600 mt-4 leading-7">
                {result.professionalSummary}
              </p>

            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-xl font-bold text-slate-900">
                Technical Skills
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">

                {result.technicalSkills?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6">

  <h3 className="text-xl font-bold text-slate-900">
    Experience
  </h3>

  <div className="mt-4 space-y-4">

    {result.experience?.map((item, index) => (
      <div
        key={index}
        className="border border-slate-200 rounded-xl p-4"
      >
        {typeof item === "object" ? (
          <>
            <h4 className="font-semibold text-slate-900">
              {item.title}
            </h4>

            <p className="text-slate-600 mt-2">
              {item.description}
            </p>
          </>
        ) : (
          <p className="text-slate-600">
            {item}
          </p>
        )}
      </div>
    ))}

  </div>

</section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6">

  <h3 className="text-xl font-bold text-slate-900">
    Projects
  </h3>

  <div className="mt-4 space-y-4">

    {result.projects?.map((item, index) => (
      <div
        key={index}
        className="border border-slate-200 rounded-xl p-4"
      >
        {typeof item === "object" ? (
          <>
            <h4 className="font-semibold text-slate-900">
              {item.title}
            </h4>

            <p className="text-slate-600 mt-2">
              {item.description}
            </p>
          </>
        ) : (
          <p className="text-slate-600">
            {item}
          </p>
        )}
      </div>
    ))}

  </div>

</section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-xl font-bold text-slate-900">
                ATS Keywords
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">

                {result.keywords?.map(
                  (keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  )
                )}

              </div>

            </section>
<div className="grid sm:grid-cols-2 gap-4">

  <button
    onClick={handleDownloadPDF}
    className="bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
  >
    Download Resume PDF
  </button>

  <button
    onClick={() => setResult(null)}
    className="border border-slate-300 bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50"
  >
    Generate Again
  </button>

</div>
            <button
              onClick={() => setResult(null)}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800"
            >
              Generate Again
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default ResumeBuilder;