import { useEffect, useState } from "react";
import { getEmployees } from "../services/api";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.employees || []))
      .catch((err) => {
        console.error("[useEmployees] Failed to fetch employees:", err);
        setError("Failed to load employees. Backend may be unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { employees, loading, error };
};
