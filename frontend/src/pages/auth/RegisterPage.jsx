import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    roleId: 2,
    fullName: "",
    email: "",
    phoneNumber: "",
    residenceId: "",
    isOwner: false,
  });
  const [residences, setResidences] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Merr listën e residencave
    const fetchResidences = async () => {
      try {
        const res = await api.get("/residences");
        setResidences(res.data);
      } catch {
        console.log("Nuk mund të merren residencat");
      }
    };
    fetchResidences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.fullName || formData.fullName.length < 3)
      return "Emri i plotë duhet të ketë minimum 3 karaktere!";
    if (!formData.username || formData.username.length < 3)
      return "Username duhet të ketë minimum 3 karaktere!";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Email nuk është valid!";
    if (!formData.phoneNumber || formData.phoneNumber.length < 9)
      return "Numri i telefonit nuk është valid!";
    if (!formData.password || formData.password.length < 6)
      return "Fjalëkalimi duhet të ketë minimum 6 karaktere!";
    if (!/[A-Z]/.test(formData.password))
      return "Fjalëkalimi duhet të ketë minimum 1 shkronjë të madhe!";
    if (!/[0-9]/.test(formData.password))
      return "Fjalëkalimi duhet të ketë minimum 1 numër!";
    if (formData.password !== formData.confirmPassword)
      return "Fjalëkalimet nuk përputhen!";
    if (!formData.residenceId) return "Ju lutem zgjidhni rezidencën!";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username: formData.username,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        residenceId: parseInt(formData.residenceId),
        isOwner: formData.isOwner,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Diçka shkoi keq!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            GS
          </div>
          <h1 className="text-3xl font-bold text-gray-800">GateSync</h1>
          <p className="text-gray-500 mt-2">Krijo një llogari të re</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emri i Plotë */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emri i Plotë *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="p.sh. Lorite Demolli"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="p.sh. lorite123"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="p.sh. lorite@email.com"
            />
          </div>

          {/* Telefoni */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numri i Telefonit *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="p.sh. 044123456"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fjalëkalimi *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Minimum 6 karaktere, 1 e madhe, 1 numër"
            />
          </div>

          {/* Konfirmo Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmo Fjalëkalimin *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Shkruaj fjalëkalimin përsëri"
            />
          </div>

          {/* Rezidenca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rezidenca *
            </label>
            <select
              name="residenceId"
              value={formData.residenceId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">-- Zgjidhni rezidencën --</option>
              {residences.map((r) => (
                <option key={r.residenceId} value={r.residenceId}>
                  {r.address}
                </option>
              ))}
            </select>
          </div>

          {/* Roli */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roli *
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value={1}>Admin</option>
              <option value={2}>Resident</option>
              <option value={3}>Security</option>
            </select>
          </div>

          {/* IsOwner */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isOwner"
              id="isOwner"
              checked={formData.isOwner}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="isOwner" className="text-sm text-gray-700">
              Jam pronar i rezidencës
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Ke llogari?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Hyr këtu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
