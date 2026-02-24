'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Charts = ({
    data: { salesData },
}: {
    data: { salesData: { date: string; totalSales: number }[] };
}) => {
    return (
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={salesData}>
                <XAxis
                    dataKey='date'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar
                    dataKey='totalSales'
                    fill='#2563eb'
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Charts;