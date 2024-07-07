import React from 'react';
import { useState, useEffect } from 'react';
import { Select, SelectItem, Input, Button, Card, CardBody, DatePicker, DateRangePicker } from '@nextui-org/react';
import {CalendarDate, parseDate} from "@internationalized/date";
import { jwtDecode } from 'jwt-decode';
const Home = () => {
    const apiUrl = process.env.REACT_APP_DEV_API;
    // expense = OUT, income = IN
    /*{
 "user": 2,
 "amount": 299.00,
 "transaction_type": "OUT",
 "description": "Salary",
 "date": "2024-08-01",
 "tags": [
  {
   "name": "bank"
  }
 ]
}*/
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('OUT');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(calculateTodayDate());
    const [tags, setTags] = useState('');
    const [transactions, setTransactions] = useState([]);

    const [xDays, setXDays] = useState(10);


    useEffect(() => {
        loadLastXDaysTransactions()
    }, []);

    const handleTransaction = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).user_id
        const response = await fetch(`${apiUrl}/transactions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user: userId,
                amount,
                transaction_type: transactionType,
                description,
                date: date.toString(),  
                tags: [{ name: tags }]
            })
        });
        const data = await response.json();
        if (data.token) {
            window.location.href = '/login';
        } else {
            console.log(xDays)
            console.log('Transaction failed');
        }

        loadLastXDaysTransactions();
    }

    const loadTransactions = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/transactions/logic/history/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.token) {
            window.location.href = '/login';
        } else {
            var dateSortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            var preciseSortedData = dateSortedData.sort((a, b) => b.id - a.id);
            setTransactions(data); 
        }
    }

    const loadLastXDaysTransactions = async (days = xDays) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/transactions/logic/history/last/${days}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.token) {
            window.location.href = '/login';
        } else {
            console.log(xDays)
            data.sort((a, b) => b.id - a.id);
            setTransactions(data);
        }
    }



    return (
        <div className='w-screen h-screen flex flex-col p-3'>
            <h1 className='text-4xl font-bold'>💸 Soldini</h1>
            <div className="grid grid-cols-4 flex-grow gap-3 p-3">
                <div className="col-span-2 flex flex-col h-full p-3 gap-3">
                    <div>
                        <h2 className='text-2xl font-bold pb-3'>Transazione nuova</h2>
                        <div className='flex grid-cols-7 gap-2'>
                            <Input 
                                label='Importo' 
                                type='number' 
                                value={amount}
                                isRequired={true}
                                onChange={(e) => setAmount(e.target.value)}
                                />
                            <Select 
                                label='Tipo'
                                isRequired={true}
                                value={transactionType}
                                color={transactionType === 'IN' ? 'success' : 'danger'}
                                defaultSelectedKeys={['OUT']}
                                disallowEmptySelection={true}
                                onChange={(e) => setTransactionType(e.target.value)}
                                >
                                <SelectItem 
                                    value='IN'
                                    key='IN'
                                    >Entrata</SelectItem>
                                <SelectItem
                                    value='OUT'
                                    key='OUT'
                                    >Uscita</SelectItem>

                            </Select>
                            <Input 
                                label='Titolo' 
                                type='text' 
                                isRequired={true}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                />
                            <DatePicker 
                                label='Data' 
                                defaultValue={calculateTodayDate} 
                                isRequired={true}
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                />
                            <Input 
                                label='Tags' 
                                type='text' 
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                />
                            <Button 
                                color='primary' 
                                style={{height: 'auto'}}
                                onClick={handleTransaction}
                                >Aggiungi</Button>
                        </div>
                    </div>
                    <div className='overflow-y-auto flex-grow' style={{height: '50vh'}}>
                        <div class="flex flex-row">
                            <h2 className='text-2xl font-bold pb-3'>Transazioni recenti - ultimi </h2>
                            <Select disallowEmptySelection={true} className='ml-3 w-20 h-fit'value={xDays} defaultSelectedKeys={["10"]} >
                                <SelectItem key='10' onClick={() => {setXDays(10); loadLastXDaysTransactions(10)}}>10</SelectItem>
                                <SelectItem key='20' onClick={() => {setXDays(20); loadLastXDaysTransactions(20)}}>20</SelectItem>
                                <SelectItem key='30' onClick={() => {setXDays(30); loadLastXDaysTransactions(30)}}>30</SelectItem>s
                            </Select>
                            <h2 className='text-2xl font-bold pb-3 ms-3'>giorni</h2>
                        </div>
                        <div>
                            {transactions.slice(0, 100).map((transaction, index) => (
                                <Card key={index}         
                                    className={`p-3 m-3 ${transaction.transaction_type === 'IN' ? 'bg-green-200' : 'bg-red-200'}`}>
                                    <CardBody>
                                        <div className='flex justify-between'>
                                            <h3>{transaction.description}</h3>
                                            <h3>{transaction.amount}</h3>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-2 flex flex-col h-full p-3">
                    {/* this part can see the month or year summary,, so after the h2, there must be a choise */}
                    <h2 className='text-2xl font-bold'>Riepilogo</h2>
                    <Select>
                        <SelectItem value='month'>Mese</SelectItem>
                        <SelectItem value='year'>Anno</SelectItem>
                    </Select>


                </div>
            </div>
        </div>
    );
};

function calculateTodayDate() {
    const pad = (num, places) => String(num).padStart(places, '0');
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var dateString = year + "-" + pad((month + 1), 2) + "-" + pad(day, 2);
    return parseDate(dateString);
}



export default Home;

