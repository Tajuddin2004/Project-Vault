
import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 5000;

await connectDatabase();
app.listen(port, () => console.log(`Project Vault API: http://localhost:${port}`));
