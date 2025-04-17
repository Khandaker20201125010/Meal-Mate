import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api/menus";

export function useMenus() {
  const [menus, setMenus]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return { menus, loading, error, refresh: fetchMenus };
}
