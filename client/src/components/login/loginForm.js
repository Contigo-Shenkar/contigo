import { useEffect, useState } from "react";
import { useLoginMutation } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [
    login,
    { isLoading, error: loginError, isSuccess: isLoginSuccess, isError },
  ] = useLoginMutation({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email && password) {
        await login({ email, password });
      }
    } catch (err) {

    }
  };

  useEffect(() => {
    if (isLoginSuccess) navigate("/dashboard");
  });

  return (
    <form onSubmit={handleSubmit}>
      {loginError && <div className="error">{loginError}</div>}
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
