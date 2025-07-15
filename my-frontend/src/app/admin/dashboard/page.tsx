// app/admin/dashboard/page.tsx
import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">$45,678</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">+23%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-gray-600">New user registered</span>
            <span className="text-sm text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-gray-600">Order #1234 completed</span>
            <span className="text-sm text-gray-500">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-gray-600">Payment received</span>
            <span className="text-sm text-gray-500">10 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;