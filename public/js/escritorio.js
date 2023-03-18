// Referencias html
const lblEscritorio = document.querySelector('h1');
const lblTicket = document.querySelector('small');
const btnAtender = document.querySelector('button');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

let ticketsPendientes = 0;

const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
};

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on( 'tickets-pendientes', ( pendientes ) => {
    ticketsPendientes = pendientes;
    lblPendientes.innerText = ticketsPendientes;
})

btnAtender.addEventListener( 'click', () => {
    
    socket.emit( 'atender-ticket', { escritorio }, ( {ok, ticket, msg} ) => {

        if( !ok ) {
            lblTicket.innerText = 'Nadie'
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = `Ticket ` + ticket.numero

    });

    /* socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    }); */

});


