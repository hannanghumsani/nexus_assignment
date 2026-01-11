'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { decryptData } from './utils/crypto';
import {
  Users, CheckCircle, XCircle,
  DollarSign, Search, Loader2,
  Phone, Mail, Filter
} from 'lucide-react';
import StatCard from './components/StatCard';
import StatusBadge from './components/StatusBadge';

// Performance Optimization: Lazy load heavy charts
const DashboardCharts = dynamic(() => import('./components/DashboardCharts'), {
  ssr: false,
  loading: () => <div className="h-80 w-full bg-gray-100 animate-pulse rounded-xl mb-10" />
});

export default function Dashboard() {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendees');
        const decrypted = decryptData(response.data.payload);
        setAttendees(decrypted);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Fixed Search & Filter Logic ---
  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.phone.includes(term);
      const matchesFilter = filterStatus === 'All' || a.paymentStatus === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [attendees, searchTerm, filterStatus]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const total = attendees.length;
    const paid = attendees.filter(a => a.paymentStatus === 'Paid').length;
    const rev = attendees.reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, unpaid: total - paid, rev };
  }, [attendees]);

  // --- Chart Data ---
  const pieData = useMemo(() => {
    const male = attendees.filter(a => a.gender === 'Male').length;
    const female = attendees.filter(a => a.gender === 'Female').length;
    const total = attendees.length || 1;
    return {
      labels: [`Male (${((male / total) * 100).toFixed(1)}%)`, `Female (${((female / total) * 100).toFixed(1)}%)`],
      datasets: [{ data: [male, female], backgroundColor: ['#3B82F6', '#EC4899'] }]
    };
  }, [attendees]);

  const lineData = useMemo(() => {
    const counts: any = {};
    attendees.forEach(a => counts[a.registrationDate] = (counts[a.registrationDate] || 0) + 1);
    const sortedDates = Object.keys(counts).sort();
    return {
      labels: sortedDates,
      datasets: [{ label: 'Registrations', data: sortedDates.map(d => counts[d]), borderColor: '#10B981', fill: true, tension: 0.4, backgroundColor: 'rgba(16, 185, 129, 0.1)' }]
    };
  }, [attendees]);

  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
  const paginatedData = filteredAttendees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination on search
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
      <p className="text-gray-500 font-medium">Decrypting Dashboard Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Attendees</h1>
        <p className="text-gray-500 mt-1">Bahrain Tech Summit 2025</p>
      </header>

      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Registrations" value={stats.total} icon={Users} color="bg-blue-600" />
        <StatCard title="Confirmed (Paid)" value={stats.paid} icon={CheckCircle} color="bg-green-600" />
        <StatCard title="Pending Payment" value={stats.unpaid} icon={XCircle} color="bg-red-500" />
        <StatCard title="Total Revenue" value={`BHD ${stats.rev.toLocaleString()}`} icon={DollarSign} color="bg-purple-600" />
      </div>

      {/* 2. Charts */}
      <DashboardCharts pieData={pieData} lineData={lineData} />

      {/* 3. Attendees Table (Restored Design) */}
      {/* 3. Attendees Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Table Controls - Restored Position & Visibility */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Name, Email or Phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Filter By:</label>
            <div className="relative w-full md:w-48">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600">Attendee Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600">Contact Info</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600">Registration Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600">Payment Source</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600">Amount</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-center">Attended Event</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                          {attendee.name.split(' ').map((n: any) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-none">{attendee.name} <span className='text-xs text-gray-500 font-medium'>{`(${attendee.gender})`}</span></p>
                          <p className="text-xs text-gray-400 font-medium mt-1">{attendee.ticketType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-900 font-medium text-sm">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{attendee.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{attendee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium text-sm">{attendee.registrationDate}</td>
                    <td className="p-4 text-gray-700 font-medium text-sm">{attendee.source}</td>
                    <td className="p-4 font-bold text-gray-900 text-sm">BHD {attendee.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${attendee.attended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {attendee.attended ? <><CheckCircle className="w-3 h-3 mr-1.5" /> Yes</> : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <StatusBadge status={attendee.paymentStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500 font-medium">
                    No attendees found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-sm font-medium text-gray-600">
            Showing <span className="text-gray-900 font-bold">{filteredAttendees.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span> to <span className="text-gray-900 font-bold">{Math.min(currentPage * itemsPerPage, filteredAttendees.length)}</span> of <span className="text-gray-900 font-bold">{filteredAttendees.length}</span> entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 text-sm font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}