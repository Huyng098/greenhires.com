import { RegisterForm } from "@/modules/Auth/register-form";

const SignupPage = () => {
  return (
    <div className="container h-screen">
      <div className="-mx-4 flex flex-wrap h-full">
        <div className="flex flex-row-reverse w-full px-4">
          <div className="shadow-three max-w-[600px] w-2/5 rounded bg-slate-100 px-6 dark:bg-dark mb-24 mt-24">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
