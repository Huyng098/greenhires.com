import ListUsersTable from "@/modules/Admin/ListUsersTable/ListUsersTable";

export default function ListUsersPage() {
  return (
    <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
      <p className="font-bold text-2xl">All Users</p>
      <div className=" bg-white rounded-l">
        <ListUsersTable />
      </div>
    </div>
  );
}
