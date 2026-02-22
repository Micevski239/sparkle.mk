import { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';

const BRAND = {
  darkGreen: '#073f35',
  green: '#7e9751',
  red: '#b12524',
};

const DEVICE_COLORS = [BRAND.darkGreen, BRAND.green, BRAND.red, '#ccc'];

type Period = 'today' | '7d' | '30d';

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('7d');
  const daysBack = period === 'today' ? 1 : period === '7d' ? 7 : 30;
  const { data, isLoading, error } = useAnalytics(daysBack);

  const views = data
    ? period === 'today' ? data.views_today
    : period === '7d' ? data.views_7d
    : data.views_30d
    : 0;

  const visitors = data
    ? period === 'today' ? data.visitors_today
    : period === '7d' ? data.visitors_7d
    : data.visitors_30d
    : 0;

  const periodLabel = period === 'today' ? 'Today' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days';

  if (error) {
    return (
      <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
        Failed to load analytics. Make sure the migration has been run.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-dark-green">Analytics</h1>
        <div className="flex bg-white rounded-lg shadow p-1 gap-1">
          {(['today', '7d', '30d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-dark-green text-white'
                  : 'text-dark-green hover:bg-off-white-1'
              }`}
            >
              {p === 'today' ? 'Today' : p === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Page Views" value={views} subtitle={periodLabel} />
            <StatCard label="Unique Visitors" value={visitors} subtitle={periodLabel} />
          </div>

          {/* Views over time */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-sm font-medium text-dark-green/70 mb-4">Views Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.views_by_day ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(d: string) => {
                      const date = new Date(d);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(d) => new Date(String(d)).toLocaleDateString()}
                    contentStyle={{ fontSize: 13 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke={BRAND.darkGreen}
                    strokeWidth={2}
                    dot={false}
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke={BRAND.green}
                    strokeWidth={2}
                    dot={false}
                    name="Visitors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two columns: Top Pages + Device Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Top Pages */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-sm font-medium text-dark-green/70 mb-4">Top Pages</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-off-white-2">
                      <th className="text-left py-2 font-medium text-dark-green">Page</th>
                      <th className="text-right py-2 font-medium text-dark-green">Views</th>
                      <th className="text-right py-2 font-medium text-dark-green">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.top_pages ?? []).map((page) => (
                      <tr key={page.page_path} className="border-b border-off-white-1">
                        <td className="py-2 text-dark-green/80 truncate max-w-[200px]">
                          {page.page_path}
                        </td>
                        <td className="py-2 text-right text-dark-green font-medium">{page.views}</td>
                        <td className="py-2 text-right text-dark-green/70">{page.visitors}</td>
                      </tr>
                    ))}
                    {(data?.top_pages ?? []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-dark-green/50">
                          No data yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-sm font-medium text-dark-green/70 mb-4">Devices</h2>
              {(data?.devices ?? []).length > 0 ? (
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.devices ?? []}
                        dataKey="count"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(props) =>
                          `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {(data?.devices ?? []).map((_, i) => (
                          <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-8 text-center text-dark-green/50">No data yet</p>
              )}
            </div>
          </div>

          {/* Referrer Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-dark-green/70 mb-4">Referrer Sources</h2>
            {(data?.referrers ?? []).length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.referrers ?? []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                    <YAxis
                      dataKey="source"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={120}
                    />
                    <Tooltip contentStyle={{ fontSize: 13 }} />
                    <Bar dataKey="count" fill={BRAND.green} name="Visits" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-8 text-center text-dark-green/50">No data yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, subtitle }: { label: string; value: number; subtitle: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-dark-green/70">{label}</p>
      <p className="text-3xl font-bold text-dark-green mt-1">{value.toLocaleString()}</p>
      <p className="text-xs text-dark-green/50 mt-1">{subtitle}</p>
    </div>
  );
}
