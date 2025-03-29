
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-md mx-auto py-10">
        <SignupForm />
      </div>
    </MainLayout>
  );
}
