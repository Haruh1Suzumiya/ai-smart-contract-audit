
import MainLayout from "@/components/layouts/MainLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export default function VerifyEmail() {
  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-md mx-auto py-10">
        <VerifyEmailForm />
      </div>
    </MainLayout>
  );
}
