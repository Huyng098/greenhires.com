"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    number: 10000,
    amt: 2400,
  },
  {
    name: "Feb",
    number: 35000,
    amt: 2210,
  },
  {
    name: "Mar",
    number: 15000,
    amt: 2290,
  },
  {
    name: "Apr",
    number: 82520,
    amt: 2000,
  },
  {
    name: "May",
    number: 36000,
    amt: 2181,
  },
  {
    name: "Jun",
    number: 36610,
    amt: 2500,
  },
  {
    name: "Jul",
    number: 11000,

    amt: 2100,
  },
  {
    name: "Aug",
    number: 12000,
    amt: 2100,
  },
  {
    name: "Sep",
    number: 31000,

    amt: 2100,
  },
  {
    name: "Oct",
    number: 36000,
    amt: 2100,
  },
  {
    name: "Nov",
    number: 30500,
    amt: 2100,
  },
  {
    name: "Dec",
    number: 40000,
    amt: 2100,
  },
];

export default function UsersStatisticsChart() {
  return (
    <ResponsiveContainer width="70%" aspect={6.0 / 3.0}>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="number"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
