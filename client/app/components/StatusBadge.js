export default function StatusBadge({ status, type = 'default' }) {
    const styles = {
        Paid: 'bg-green-100 text-green-700',
        Unpaid: 'bg-red-100 text-red-700',
        Active: 'bg-blue-100 text-blue-700',
        New: 'bg-purple-100 text-purple-700',
        Expired: 'bg-gray-100 text-gray-700',
    };

    const styleClass = styles[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styleClass}`}>
            {status}
        </span>
    );
}