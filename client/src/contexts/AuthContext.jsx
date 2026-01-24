import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchUser = async (authToken) => {
        if (!authToken) {
            setLoading(false);
            return;
        }

        try {
            console.log("🔍 Verifying session with backend...");
            const response = await fetch('http://127.0.0.1:8000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("👤 User session verified:", userData.email);
                setUser(userData);
            } else {
                console.warn("⚠️ Session invalid or expired. Clearing token.");
                setToken(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('❌ Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const { token: newToken, user: userData } = await response.json();
                console.log("✅ Login successful for:", userData.email);
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (err) {
            console.error("❌ Login request failed:", err);
            return { success: false, error: "CONNECTION_ERROR" };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                const { token: newToken, user: userData } = await response.json();
                console.log("✅ Signup successful for:", userData.email);
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (err) {
            console.error("❌ Signup request failed:", err);
            return { success: false, error: "CONNECTION_ERROR" };
        }
    };

    const googleLogin = async (idToken) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken })
            });

            if (response.ok) {
                const { token: newToken, user: userData } = await response.json();
                console.log("✅ Google Auth successful for:", userData.email);
                localStorage.setItem('token', newToken);
                setToken(newToken);
                setUser(userData);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (err) {
            console.error("❌ Google Login request failed:", err);
            return { success: false, error: "CONNECTION_ERROR" };
        }
    };

    const logout = () => {
        console.log("🚪 Logging out user...");
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        login,
        signup,
        googleLogin,
        logout,
        refreshUser: () => fetchUser(token),
        isAuthenticated: !!token && !!user, // Both must be present for full UI reflection
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
