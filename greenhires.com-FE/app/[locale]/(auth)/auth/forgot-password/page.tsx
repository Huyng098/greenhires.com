import { ForgotPassword } from "@/modules/Auth/forgot-form/forgot-password";
import Banner from "@/modules/Home/Banner";

export default async function ForgetPage() {
  return (
    <>
      <Banner type="cv" />
      <ForgotPassword />
    </>
  );
}
