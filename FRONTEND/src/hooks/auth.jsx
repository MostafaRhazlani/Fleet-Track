import { useEffect } from "react";
import { useState } from "react"
import api from "../tools/axios";

export const useAuthenticatedUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthenticatedUser() {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    checkAuthenticatedUser();
  }, []);
  
  return { user, loading};
}
