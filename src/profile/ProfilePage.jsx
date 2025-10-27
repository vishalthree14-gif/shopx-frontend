import { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {

  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!res.ok) setError(data.message || "Failed to fetch profile.");
      else setUserProfile(data.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {

    navigate("/editProfile");

  }

  return (
    <div className="profile-wrapper">
      {loading && <p>Loading profile...</p>}
      {error && <p>{error}</p>}
      {userProfile && (
        <div className="profile-container">

            <div className="image-container">
                <img src="https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U" alt="image here" />
            </div>

            <div>
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Phone:</strong> {userProfile.phone}</p>
                <p><strong>Age:</strong> {userProfile.age}</p>
                <p><strong>Gender:</strong> {userProfile.gender}</p>
            </div>

            <button onClick={handleEdit}> Edit Profile </button>
        </div>
      )}
      {!loading && !error && !userProfile && <p>Profile not found...</p>}
    </div>
  );
};

export default ProfilePage;
