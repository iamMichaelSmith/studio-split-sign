const net = require('node:net');
const { once } = require('node:events');

async function startSmtpSink() {
  const messages = [];
  const sockets = new Set();
  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.setEncoding('utf8');
    socket.write('220 localhost test mail sink\r\n');
    let buffer = '';
    let inData = false;
    let recipients = [];
    socket.on('data', (chunk) => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        if (inData) {
          const end = buffer.indexOf('\r\n.\r\n');
          if (end < 0) return;
          messages.push({ recipients: [...recipients], raw: buffer.slice(0, end) });
          buffer = buffer.slice(end + 5);
          inData = false;
          recipients = [];
          socket.write('250 message captured locally\r\n');
          continue;
        }
        const end = buffer.indexOf('\r\n');
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (/^(EHLO|HELO) /i.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
        else if (/^AUTH /i.test(line)) socket.write('235 authenticated for test\r\n');
        else if (/^RCPT TO:/i.test(line)) {
          recipients.push(line.match(/<([^>]+)>/)?.[1] || '');
          socket.write('250 accepted\r\n');
        } else if (line === 'DATA') {
          inData = true;
          socket.write('354 send data\r\n');
        } else if (line === 'QUIT') socket.end('221 goodbye\r\n');
        else socket.write('250 accepted\r\n');
      }
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return {
    messages,
    environment: {
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(server.address().port),
      SMTP_SECURE: 'false',
      SMTP_USER: 'sender@example.test',
      SMTP_PASS: 'test-mail-sink-only',
      FROM_EMAIL: 'sender@example.test'
    },
    async stop() {
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve) => server.close(resolve));
    }
  };
}

function emailToken(message, route) {
  const decoded = message.raw.replace(/=\r\n/g, '').replace(/=([\dA-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  const match = decoded.match(new RegExp(`${route}\\?token=([^"\\s<>]+)`));
  if (!match) throw new Error(`Expected ${route} token in locally captured email`);
  return decodeURIComponent(match[1]);
}

module.exports = { startSmtpSink, emailToken };
