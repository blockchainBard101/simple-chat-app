const io = require('socket.io-client');

async function testChat() {
    const client1 = io('http://localhost:3003');
    const client2 = io('http://localhost:3003');

    let client1Connected = false;
    let client2Connected = false;

    client1.on('connect', () => {
        console.log('Client 1 connected');
        client1Connected = true;
        checkAndSend();
    });

    client2.on('connect', () => {
        console.log('Client 2 connected');
        client2Connected = true;
        checkAndSend();
    });

    client1.on('reply-message', (data) => {
        console.log('Client 1 received:', data);
        console.error('FAILURE: Client 1 (sender) should NOT receive the message via broadcast!');
        process.exit(1);
    });

    client2.on('reply-message', (data) => {
        console.log('Client 2 received:', data);
        if (data === 'Hello from Client 1') {
            console.log('SUCCESS: Client 2 received the message!');
            process.exit(0);
        }
    });

    function checkAndSend() {
        if (client1Connected && client2Connected) {
            console.log('Both connected. Client 1 sending message...');
            setTimeout(() => {
                client1.emit('message', 'Hello from Client 1');
            }, 500);
        }
    }

    // Timeout failure
    setTimeout(() => {
        console.error('TIMEOUT: Message not received within 5 seconds.');
        process.exit(1);
    }, 5000);
}

testChat();
