const io = require( "socket.io" )();
const socketapi = {
    io: io
};
const user_model = require("./models/user_Schema")

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on("join", async username=>{
        await user_model.findOneAndUpdate({
            username
        },{
            socketId: socket.id
        })
    })

    socket.on('disconnect', async () => {

        await user_model.findOneAndUpdate({
            socketId: socket.id
        }, {
            socketId: ""
        })

    })

    socket.on('sony', async messageObject => {


        const sender = await user_model.findOne({
            username: messageObject.sender
        })
        const receiver = await user_model.findOne({
            username: messageObject.receiver
        })

        const messagePacket = {
            sender: sender,
            receiver: receiver,
            text: messageObject.text
        }

        socket.to(receiver.socketId).emit('max', messagePacket)


    })


});


// end of socket.io logic

module.exports = socketapi;