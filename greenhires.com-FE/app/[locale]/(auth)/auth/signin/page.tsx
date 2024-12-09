import { LoginForm } from "@/modules/Auth/login-form";

export default function SigninPage() {
  return (
    <>
      <section
        className="z-10 h-full bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/images/auth/left_sign_in.svg")' }}
      >
        <div className="container h-screen">
          <div className="-mx-4 flex flex-wrap">
            <div className="flex flex-row-reverse w-full px-4">
              <div
                className="shadow-three max-w-[600px] w-2/5 rounded 
                bg-slate-100 px-6 py-10 dark:bg-dark mb-24 mt-24"
              >
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
