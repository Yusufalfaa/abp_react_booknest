"use client"

import { useState, useEffect } from "react"
import "./profile.css"
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  serverTimestamp,
} from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()

  // State for user authentication
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // State for tabs
  const [activeTab, setActiveTab] = useState("profile")

  // State for profile information
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [gender, setGender] = useState("")

  // State for editing mode
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingMobile, setIsEditingMobile] = useState(false)
  const [isEditingGender, setIsEditingGender] = useState(false)

  // Temporary state for editing
  const [tempUsername, setTempUsername] = useState("")
  const [tempEmail, setTempEmail] = useState("")
  const [tempMobileNumber, setTempMobileNumber] = useState("")
  const [tempGender, setTempGender] = useState("")

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // State for avatar
  const [selectedAvatar, setSelectedAvatar] = useState("/assets/25.png")
  const [showPhotoSelector, setShowPhotoSelector] = useState(false)

  // State for loading and errors
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Available avatars
  const avatars = [
    "/assets/25.png",
    "/assets/26.png",
    "/assets/27.png",
    "/assets/28.png",
    "/assets/29.png",
    "/assets/30.png",
  ]

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser)
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        loadUserProfile(currentUser)
      } else {
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const loadUserProfile = async (currentUser) => {
    try {
      setIsLoadingProfile(true)
      console.log("Loading profile for user:", currentUser.uid)
      console.log("User displayName:", currentUser.displayName)
      console.log("User email:", currentUser.email)

      const userRef = doc(db, "users", currentUser.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        console.log("User data from Firestore:", userData)

        // Set data dari Firestore
        const displayUsername = userData.username || currentUser.displayName || ""
        const displayEmail = userData.email || currentUser.email || ""
        const displayMobile = userData.mobileNumber || ""
        const displayGender = userData.gender || ""
        const displayAvatar = userData.avatar || currentUser.photoURL || "/assets/25.png"

        setUsername(displayUsername)
        setEmail(displayEmail)
        setMobileNumber(displayMobile)
        setGender(displayGender)
        setSelectedAvatar(displayAvatar)

        // Update temporary states
        setTempUsername(displayUsername)
        setTempEmail(displayEmail)
        setTempMobileNumber(displayMobile)
        setTempGender(displayGender)
      } else {
        console.log("No user document found, creating new one...")
        // Jika dokumen user belum ada, buat dengan data dari Auth
        const newUserData = {
          uid: currentUser.uid,
          username: currentUser.displayName || "",
          email: currentUser.email || "",
          mobileNumber: "",
          gender: "",
          avatar: currentUser.photoURL || "/assets/25.png",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        // Simpan ke Firestore
        await setDoc(userRef, newUserData)

        // Set state dengan data baru
        setUsername(newUserData.username)
        setEmail(newUserData.email)
        setMobileNumber(newUserData.mobileNumber)
        setGender(newUserData.gender)
        setSelectedAvatar(newUserData.avatar)

        setTempUsername(newUserData.username)
        setTempEmail(newUserData.email)
        setTempMobileNumber(newUserData.mobileNumber)
        setTempGender(newUserData.gender)

        console.log("New user document created:", newUserData)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setSaveMessage("Error loading profile data")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Function untuk save user data ke Firestore
  const saveUserProfile = async (userData) => {
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      })
      console.log("Profile updated successfully:", userData)
      return true
    } catch (error) {
      console.error("Error saving user profile:", error)
      return false
    }
  }

  // Handler functions
  const handleSaveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Update the actual state with temporary values
      setUsername(tempUsername)
      setEmail(tempEmail)
      setMobileNumber(tempMobileNumber)
      setGender(tempGender)

      // Create updated user object
      const updatedUser = {
        username: tempUsername,
        email: tempEmail,
        mobileNumber: tempMobileNumber,
        gender: tempGender,
        avatar: selectedAvatar,
      }

      // Save to Firestore
      const success = await saveUserProfile(updatedUser)

      if (success) {
        setSaveMessage("Profile updated successfully!")
        // Reset all editing states
        setIsEditingUsername(false)
        setIsEditingEmail(false)
        setIsEditingMobile(false)
        setIsEditingGender(false)
      } else {
        setSaveMessage("Failed to update profile. Please try again.")
      }
    } catch (error) {
      setSaveMessage("Error updating profile. Please try again.")
    } finally {
      setIsSaving(false)
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSaveMessage("New passwords don't match!")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    if (!currentPassword || !newPassword) {
      setSaveMessage("Please fill all password fields")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    if (newPassword.length < 6) {
      setSaveMessage("New password must be at least 6 characters")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)

      setSaveMessage("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error updating password:", error)
      if (error.code === "auth/wrong-password") {
        setSaveMessage("Current password is incorrect")
      } else {
        setSaveMessage("Failed to update password. Please try again.")
      }
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleSelectAvatar = async (avatar) => {
    setSelectedAvatar(avatar)
    setShowPhotoSelector(false)

    // Auto-save avatar change
    try {
      await saveUserProfile({ avatar })
      setSaveMessage("Avatar updated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Failed to update avatar")
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  // Toggle edit mode for a field
  const toggleEdit = (field) => {
    switch (field) {
      case "username":
        setIsEditingUsername(!isEditingUsername)
        if (!isEditingUsername) setTempUsername(username)
        break
      case "email":
        setIsEditingEmail(!isEditingEmail)
        if (!isEditingEmail) setTempEmail(email)
        break
      case "mobile":
        setIsEditingMobile(!isEditingMobile)
        if (!isEditingMobile) setTempMobileNumber(mobileNumber)
        break
      case "gender":
        setIsEditingGender(!isEditingGender)
        if (!isEditingGender) setTempGender(gender)
        break
      default:
        break
    }
  }

  // Loading state
  if (loading || isLoadingProfile) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <h2>Please login to view your profile</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      {/* Success/Error Message */}
      {saveMessage && (
        <div className={`save-message ${saveMessage.includes("success") ? "success" : "error"}`}>{saveMessage}</div>
      )}

      {/* Header with new background */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src={selectedAvatar || "/assets/25.png"} alt="User profile" className="avatar-image" />
            </div>
            <div className="profile-info">
              <h1>Profile</h1>
              <p className="username">{username || "Username"}</p>
              <p className="email">{email || "email@example.com"}</p>
            </div>
            {/* Update Photo button positioned at the right */}
            <div style={{ marginLeft: "auto", alignSelf: "flex-start", marginTop: "20px" }}>
              <button className="update-photo-btn" onClick={() => setShowPhotoSelector(true)}>
                Update Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="profile-body">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="profile-form">
            <div className="form-fields">
              {/* Username Field */}
              <div className="form-field">
                <div className="field-icon user-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="field-label">Username</div>
                <div className="field-value">
                  {isEditingUsername ? (
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    username || "Not set"
                  )}
                </div>
                <div className="field-actions">
                  <button className="edit-button" onClick={() => toggleEdit("username")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Email Field */}
              <div className="form-field">
                <div className="field-icon email-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#6b7280" strokeWidth="2" />
                    <path d="M2 7L12 14L22 7" stroke="#6b7280" strokeWidth="2" />
                  </svg>
                </div>
                <div className="field-label">Email</div>
                <div className="field-value">{email || "Not set"}</div>
                <div className="field-actions">
                  {/* Email editing disabled for Firebase Auth users */}
                  <span className="edit-disabled">📧</span>
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="form-field">
                <div className="field-icon phone-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 16.92V19.92C22 20.4704 21.7893 20.9996 21.4142 21.3747C21.0391 21.7498 20.5099 21.9605 19.96 21.96C16.4223 21.6505 13.0418 20.3799 10.17 18.33C7.54566 16.4803 5.39541 14.3301 3.54 11.71C1.48256 8.82986 0.211151 5.43577 0 1.88C-0.000737683 1.33115 0.209451 0.802903 0.583232 0.427871C0.957013 0.0528394 1.48436 -0.158596 2.03 -0.16H5.03C6.08 -0.16 6.95 0.59 7.13 1.62C7.24031 2.29 7.42308 2.94706 7.67 3.58C7.93348 4.27679 7.82341 5.05466 7.38 5.65L6.09 7.29C7.81276 10.0175 10.0125 12.2172 12.74 13.94L14.38 12.65C14.9754 12.2066 15.7533 12.0965 16.45 12.36C17.0829 12.607 17.74 12.7897 18.41 12.9C19.4548 13.0817 20.2099 13.9882 20.16 15.05L20.16 16.92H22Z"
                      stroke="#6b7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="field-label">Mobile number</div>
                <div className="field-value">
                  {isEditingMobile ? (
                    <input
                      type="text"
                      value={tempMobileNumber}
                      onChange={(e) => setTempMobileNumber(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    mobileNumber || "Not set"
                  )}
                </div>
                <div className="field-actions">
                  <button className="edit-button" onClick={() => toggleEdit("mobile")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Gender Field */}
              <div className="form-field">
                <div className="field-icon gender-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="5" stroke="#6b7280" strokeWidth="2" />
                    <path d="M12 13V21M8 17H16" stroke="#6b7280" strokeWidth="2" />
                  </svg>
                </div>
                <div className="field-label">Gender</div>
                <div className="field-value">
                  {isEditingGender ? (
                    <select value={tempGender} onChange={(e) => setTempGender(e.target.value)} className="edit-input">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    gender || "Not set"
                  )}
                </div>
                <div className="field-actions">
                  <button className="edit-button" onClick={() => toggleEdit("gender")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="password-form">
            <div className="password-fields">
              <div className="password-field">
                <label className="password-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="password-input"
                  placeholder="Enter your current password"
                />
              </div>

              <div className="password-field">
                <label className="password-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="password-field">
                <label className="password-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="password-input"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={handleSavePassword} disabled={isSaving}>
                {isSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo Selector Modal */}
      {showPhotoSelector && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Choose Profile Picture</h3>
              <button onClick={() => setShowPhotoSelector(false)} className="close-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="avatar-grid">
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className={`avatar-option ${selectedAvatar === avatar ? "selected" : ""}`}
                  onClick={() => handleSelectAvatar(avatar)}
                >
                  <div className="avatar-image-container">
                    <img src={avatar || "/assets/25.png"} alt={`Avatar option ${index + 1}`} className="avatar-image" />
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowPhotoSelector(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={() => setShowPhotoSelector(false)} className="select-button">
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
