import Appearance from "@/modules/Dashboard/Profile/Appearance";
import MyAccountForm from "@/modules/Dashboard/Profile/MyAccountForm";

export default function MyAccountPage() {
  return (
    <>
      <div className="p-8 w-full flex flex-col gap-5 items-center">
        <MyAccountForm />
        <Appearance />
      </div>
    </>
  );
}
