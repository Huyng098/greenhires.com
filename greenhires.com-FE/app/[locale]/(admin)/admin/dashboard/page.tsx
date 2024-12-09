import CardStatistics from "@/modules/Admin/Dashboard/CardStatistics";
import UsersStatisticsChart from "@/modules/Admin/Dashboard/UsersStatisticsChart";
import ListSubcriptionsTable from "@/modules/Admin/ListSubscriptionsTable.tsx/ListSubcriptionsTable";


const cards = [
    {
        title: 'Total Users',
        number: 40686,
        icon: '/icons/dashboard/card_icon1.svg',
        icon_trending: '/icons/dashboard/ic-trending-up.svg',
        trend_number: 8.5
    },
    {
        title: 'Total Subscription',
        number: 10294,
        icon: '/icons/dashboard/card_icon2.svg',
        icon_trending: '/icons/dashboard/ic-trending-up.svg',
        trend_number: 8.5
    },
]

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col gap-6 py-16 px-8 w-full bg-[#f7f9fb]">
        <p className="font-bold text-2xl">Dashboard</p>
        <div className="flex flex-col gap-10"></div>
        <div className="flex gap-3">
          {" "}
          {cards.map((item,idx) => (
            <CardStatistics key={idx} title={item.title} number={item.number} icon={item.icon} icon_trending={item.icon_trending} trend_number={item.trend_number} />
          ))}
        </div>
        <div className="w-full py-10 flex flex-col items-center bg-white rounded-lg px-8">
            <div className="w-full flex">
                <p className="font-bold text-xl">Users Details</p>
            </div>
            <UsersStatisticsChart/>
        </div>
        <div className="bg-white rounded-l">
        <ListSubcriptionsTable />
      </div>
      </div>
    </>
  );
}
