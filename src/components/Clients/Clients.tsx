import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ClientDetail, { ClientDetailProps, ClientDetailState } from './ClientDetail';
import { Client } from '../../Models/Client.model';

interface ClientListState extends Client{
    clients: ClientDetailState[];
}

interface ClientListProps {
    computedMatch: any;
    client: ClientDetailProps;
}

const Clients = (props: ClientListProps) => {
    const [clients, setClients] = useState<ClientListState[]>([]);
    const [searchClients, setSearchClients] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<ClientListState[]>([]);

    useEffect (() => {
        async function getClients() {
            let url = `/api_v1/accounts/profiles/`
           
            const response = await fetch(url);
            if(!response.ok) {
                console.log(response);
            } else {
                const data = await response.json();
                setClients(data);
            }
        }
        getClients();
    }, []);

    const clientList = searchClients ? filteredResults : clients;
    const ClientHTML = clientList
    .filter(client => props.computedMatch.params.filter === 'pt' ? client.is_client : client)
    .map(client => 
        <div className='client-detail-column'>
        <ClientDetail
            key={client.id}
            client={client}
        />
        </div>
        )

    
    useEffect (() => {
        if (searchClients !== '') {
            const filteredData = clients.filter((client) => {
                const checkValues = {
                    first_name: client.first_name,
                    last_name: client.last_name,
                    email: client.email
                }
                return Object.values(checkValues).join('').toLowerCase().includes(searchClients.toLowerCase())
            });
            setFilteredResults(filteredData)
        } else {
            setFilteredResults(clients)
        }
    }, [,searchClients]);

    const searchItems = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchClients(event.target.value);
    }

        
    return (
        <div className='client-container'>
            <nav className='client-nav'>
                <NavLink to='/clients/'>All Members</NavLink>
                <NavLink to='/clients/pt/'>Personal Training Clients</NavLink>
                <input className='client-search' type='text' name='search' id='search' autoComplete='off' placeholder='Search Here...' onChange={searchItems}></input>
            </nav>

                <section className='client-list'>
                    {ClientHTML}
                </section>
        
        </div>
    )
}

export default Clients