import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Arquivo para armazenar marcações
const bookingsFile = path.join(__dirname, 'bookings.json');

// Inicializar arquivo de marcações se não existir
if (!fs.existsSync(bookingsFile)) {
    fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
}

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para receber marcações
app.post('/api/bookings', (req, res) => {
    try {
        const booking = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        // Ler marcações existentes
        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
            const data = fs.readFileSync(bookingsFile, 'utf8');
            bookings = JSON.parse(data);
        }

        // Adicionar nova marcação
        bookings.push(booking);

        // Guardar marcações
        fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

        // Log da marcação
        console.log('Nova marcação recebida:', booking);

        // Responder com sucesso
        res.json({
            success: true,
            message: 'Marcação recebida com sucesso',
            bookingId: booking.id
        });

    } catch (error) {
        console.error('Erro ao processar marcação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar marcação'
        });
    }
});

// Rota para obter todas as marcações (apenas para administração)
app.get('/api/bookings', (req, res) => {
    try {
        if (fs.existsSync(bookingsFile)) {
            const data = fs.readFileSync(bookingsFile, 'utf8');
            const bookings = JSON.parse(data);
            res.json(bookings);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro ao ler marcações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao ler marcações'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
    console.log('Bem-Estar Holístico - Página de Serviços');
});

