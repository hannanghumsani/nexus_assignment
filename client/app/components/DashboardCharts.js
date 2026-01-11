import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler
} from 'chart.js';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    Title, Filler
);

export default function DashboardCharts({ pieData, lineData }) {

    // --- 1. Define Line Options Here ---
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Hiding legend saves space/processing
            tooltip: { enabled: true }
        },
        elements: {
            point: {
                radius: 0, // PERFORMANCE FIX: Stops rendering individual points
                hitRadius: 10, // Allows hover to still work
                hoverRadius: 4
            },
            line: {
                borderWidth: 2,
                tension: 0.4 // Smooth curve
            }
        },
        scales: {
            x: {
                display: true,
                grid: { display: false } // Cleaner look
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    };

    const pieOptions = {
        plugins: {
            legend: { position: 'bottom' }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Registration Timeline</h3>
                <div className="h-64">
                    {/* --- 2. Pass lineOptions here --- */}
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <h3 className="text-lg font-bold mb-4 text-gray-700">Gender Distribution</h3>
                <div className="w-56 h-56">
                    <Pie data={pieData} options={pieOptions} />
                </div>
            </div>
        </div>
    );
}