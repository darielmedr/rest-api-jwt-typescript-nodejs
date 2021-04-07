import dotven from 'dotenv';
const result = dotven.config();
if (result.error) {
    console.error(result.error);
} else {
    console.log('Environment variables are ready');
}

import app from './app';
import './database';

app.listen(app.get('port'));
console.log(`Server on port ${app.get('port')}`);