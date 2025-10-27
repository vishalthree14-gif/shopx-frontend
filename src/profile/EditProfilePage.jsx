import { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setError("No access token found. Please log in.");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch profile.");
      } else {
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching profile.");
    } finally {
      setLoading(false);
    }
  };

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
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/updateUserProfile`,
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

      if (!res.ok) setError(data.message || "Failed to update profile.");
      else setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdatePass = () =>{

    navigate('/updatePass');

  }


  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Edit Profile</h2>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="profile-row">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="profile-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="profile-row">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Edit Profile</button>
            <button type="button" onClick={handleUpdatePass}>Update Password</button>

        </form>
        
      </div>
    </div>
  );
};

export default EditProfilePage;
