// backend/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const CryptoJS = require('crypto-js');
const compression = require('compression');

const app = express();
const PORT = 5000;
const SECRET_KEY = "my-secret-key-123";

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// --- Authentic Bahraini Data Generator ---
const ticketTypes = ['General Admission', 'VIP Access', 'Early Bird', 'Student'];
const sources = ['BenefitPay', 'CrediMax', 'Manual', 'Cash'];

const maleNames = ['Ahmed', 'Mohammed', 'Ali', 'Yusuf', 'Salman', 'Hamad', 'Abdulla', 'Khalid', 'Omar', 'Ebrahim'];
const femaleNames = ['Fatima', 'Zainab', 'Noor', 'Mariam', 'Aysha', 'Layla', 'Reem', 'Sarah', 'Dana', 'Hessa'];
const familyNames = ['Al-Khalifa', 'Al-Alawi', 'Hasan', 'Al-Zayani', 'Al-Jalahma', 'Nasser', 'Fakhro', 'Kanoo', 'Janahi', 'Al-Musallam'];

const generateData = () => {
    const data = [];

    // Increased to 60 to ensure pagination shows
    for (let i = 1; i <= 35; i++) {
        const isMale = Math.random() > 0.45; // ~55% Male
        const firstName = isMale
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];
        const lastName = familyNames[Math.floor(Math.random() * familyNames.length)];
        const fullName = `${firstName} ${lastName}`;

        // Bahrain Mobile Format
        const randomNum = Math.floor(Math.random() * 89999999) + 10000000;
        const phone = `+973 3${randomNum.toString().substring(0, 7)}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;

        // Payment Logic
        const isPaid = Math.random() > 0.2; // 80% Paid
        const ticket = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
        const amount = ticket === 'VIP Access' ? 50 : ticket === 'Student' ? 10 : 25;

        // Attendance Logic: Only paid users can attend, roughly 70% attendance rate
        const hasAttended = isPaid && Math.random() > 0.3;

        data.push({
            id: i,
            name: fullName,
            gender: isMale ? 'Male' : 'Female',
            email: email,
            phone: phone,
            ticketType: ticket,
            registrationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
            source: sources[Math.floor(Math.random() * sources.length)],
            amount: isPaid ? amount : 0,
            paymentStatus: isPaid ? 'Paid' : 'Unpaid',
            attended: hasAttended, // Boolean
            status: isPaid ? 'Confirmed' : 'Pending'
        });
    }
    return data.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
};

const attendeesData = generateData();

app.get('/api/attendees', (req, res) => {
    const jsonString = JSON.stringify(attendeesData);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    setTimeout(() => { res.json({ payload: encrypted }); }, 500);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});