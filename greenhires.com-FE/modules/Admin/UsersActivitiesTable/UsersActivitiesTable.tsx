import { Acitivity, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Acitivity[]> {
  // Fetch data from your API here.
  return Array.from({ length: 20 }, () => ({
    date: new Date("04-14-2024"),
    member: "Luu Truong Giang",
    role: "Admin",
    action: "Create Template",
    description: "Creating template “Designer” and waiting to review",
  }));
}

export default async function UsersAcitivitesTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
