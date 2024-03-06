export default function useAuth() {
  const authToken = localStorage.getItem("token");
  const isAuthenticated = authToken && authToken !== "";

  return {
    isAuthenticated,
  };
}
