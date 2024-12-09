"use client";
import { Input } from "@/components/controls";
const PersonalInforPage = () => {
  return (
    <div className="flex flex-row">
      <div
        className={`${
          true ? "translate-x-0" : "-translate-x-52"
        }  m-10 transition-transform ease-in-out duration-300`}
      >
        <p className="text-2xl font-bold my-5">My Account</p>
        <p className="text-lg my-5">You can change your account here</p>
        <div className="flex flex-col gap-10">
          <div className="flex flex-row gap-5">
            <Input
              id="firstname"
              label={"First name"}
              className="rounded-md"
              required
            />
            <Input
              id="lastname"
              label={"Last name"}
              className="rounded-md"
              required
            />
          </div>
          <div>
            <Input id="email" label={"Email"} className="rounded-md" required />
          </div>
          <div className="flex flex-row-reverse">
            <button className="shadow-submit dark:shadow-submit-dark flex w-1/8 items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
              Save Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInforPage;
