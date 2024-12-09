import AddNewUserForm from "@/modules/Admin/ManageUser/AddNewUserForm";

export default function AddNewUserPage() {
  return (
    <>
      <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
        <p className="font-bold text-2xl">Add new user</p>
        <div className="pt-10 bg-white rounded-lg px-8 pb-5">
          <AddNewUserForm />
        </div>
      </div>
    </>
  );
}
