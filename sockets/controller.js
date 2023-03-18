const { TicketControl } = require("../models/TicketContol");

const ticketContol = new TicketControl();

const socketController = (socket) => {
   
    socket.emit( 'ultimo-ticket', ticketContol.ultimo );
    socket.emit( 'estado-actual', ticketContol.ultimos4 );
    socket.emit( 'tickets-pendientes', ticketContol.tickets.length );

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketContol.siguiente();
        callback( siguiente );

        socket.broadcast.emit( 'tickets-pendientes', ticketContol.tickets.length );
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        
        if( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio',
            });
        }

        const ticket = ticketContol.atenderTicket( escritorio );

        socket.broadcast.emit( 'estado-actual', ticketContol.ultimos4 );

        if( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes',
            })
        }else{
            callback({
                ok: true,
                ticket,
            })
        }

        socket.emit( 'tickets-pendientes', ticketContol.tickets.length );
        socket.broadcast.emit( 'tickets-pendientes', ticketContol.tickets.length );

    })
}

module.exports = {
    socketController,
}
