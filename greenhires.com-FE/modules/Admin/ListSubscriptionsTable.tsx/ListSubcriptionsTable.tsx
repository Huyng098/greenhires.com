import { Subscription, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Subscription[]> {
  // Fetch data from your API here.
  return Array.from({ length: 30 }, () => ({
    name: "7-Days trial",
    user_id: "1234",
    user_name: "giangluu",
    amount: 2.36,
    date_start: new Date("01-01-2024"),
    date_end: new Date("01-01-2024"),
  }));
}

export default async function ListSubcriptionsTable() {
  const data = await getData();

  return (
    <div className="px-8 py-10">
      <p className="font-bold text-xl">Subscription Details</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
