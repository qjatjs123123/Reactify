const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
const members = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'member.json')), 'utf8');
const tickets = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'ticket.json')), 'utf8');

app.get('/members/:id', (req, res) => {
    const { id } = req.params;
    const member = members.find(member => member.id === id);

    if (!member) {
        return res.status(404).json({ error: '멤버를 찾을 수 없습니다.' });
    }

    res.json(member);
});

app.get('/tickets/:name/:date?', (req, res) => { 
    const { name, date } = req.params;  
    
    const page = parseInt(req.query.page) || 1;
    const limit = 10;


    const activeMembers = tickets.filter(member => {
        let matchesDate = true;
        if (date) {
            matchesDate = member.departureDate === date;
        }

        return member.name === name && matchesDate && member.canceled === false;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = activeMembers.slice(startIndex, endIndex);


    res.json({
        totalResults: activeMembers.length,
        currentPage: page,
        totalPages: Math.ceil(activeMembers.length / limit),
        results: paginatedResults
    });
});


app.post('/tickets', (req, res) => {
    const { name, travelType, ticketDate, departureDate } = req.body;

    if (!name || !travelType || !ticketDate || !departureDate) {
        return res.status(400).json({ error: '모든 필드를 입력해야 합니다.' });
    }


    const newTicket = {
        id: tickets.length > 0 ? tickets[tickets.length - 1].id + 1 : 1, 
        name,
        travelType,
        ticketDate,
        departureDate,
        canceled: false
    };

    tickets.push(newTicket);

    fs.writeFileSync(path.join(__dirname, '..', 'db', 'ticket.json'), JSON.stringify(tickets, null, 2), 'utf8');

    res.status(200).json({ message: '티켓이 생성되었습니다.', ticket: newTicket });
});

// app.get('/tickets/:name', (req, res) => {
//     const { name } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;

//     const activeMembers = tickets.filter(member => member.name === name && member.canceled === false);
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const paginatedResults = activeMembers.slice(startIndex, endIndex);

//     if (paginatedResults.length === 0) {
//         return res.status(404).json({ error: '활성화된 멤버를 찾을 수 없습니다.' });
//     }

//     res.json({
//         totalResults: activeMembers.length,
//         currentPage: page,
//         totalPages: Math.ceil(activeMembers.length / limit),
//         results: paginatedResults
//     });
// });

app.delete('/tickets/:id', (req, res) => {
    const { id } = req.params;

 
    const ticketIndex = tickets.findIndex(ticket => ticket.id === parseInt(id));

    if (ticketIndex === -1) {
        return res.status(404).json({ error: '티켓을 찾을 수 없습니다.' });
    }


    tickets[ticketIndex].canceled = true; 


    res.json({ message: '티켓이 취소되었습니다.', ticket: tickets[ticketIndex] });
});

app.get('/tickets/date/:date', (req, res) => {
    const { date } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const filteredTickets = tickets.filter(ticket => ticket.departureDate === date && ticket.canceled === false);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = filteredTickets.slice(startIndex, endIndex);


    res.json({
        totalResults: filteredTickets.length,
        currentPage: page,
        totalPages: Math.ceil(filteredTickets.length / limit),
        results: paginatedResults
    });
});


app.use(express.static(path.join(__dirname, '..')));

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`START SERVER`);
});