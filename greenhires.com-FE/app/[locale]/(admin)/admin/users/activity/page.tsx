import UsersAcitivitesTable from "@/modules/Admin/UsersActivitiesTable/UsersActivitiesTable";



export default function ListUsersPage () {
    return (
        <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
            <p className="font-bold text-2xl">User Activity</p>
            <div className=" bg-white rounded-lg">
                <UsersAcitivitesTable/>
            </div>
        </div>
    )
}