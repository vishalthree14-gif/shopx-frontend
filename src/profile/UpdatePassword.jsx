import { useState } from "react";
import "./ProfilePage.css"; // reuse existing CSS or create a separate one

const UpdatePasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/updatePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) setError(data.message || "Failed to update password.");
      else setSuccess("Password updated successfully!");
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Update Password</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="profile-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-row">
            <label>Current Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-row">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
