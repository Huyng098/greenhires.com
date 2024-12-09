import { TransactionDto } from "@/interfaces/payment/payment";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface Props {
  transactions: TransactionDto[];
}

export default function BillingHistory({ transactions }: Props) {
  return (
    <>
      <div className="flex flex-col gap-5 w-10/12 rounded-lg shadow-md px-9 py-16 border border-solid border-hoduc-bg-gray_darker bg-white">
        <p className="font-bold text-xl">Billing History</p>
        <DataTable columns={columns} data={transactions} />
      </div>
    </>
  );
}
