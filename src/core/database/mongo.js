import { error as _error, info } from '../logger';
import { connect } from 'mongoose';
import { MONGO_URL } from '../config';

const connectMongo = () => {
    connect(MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        (error) => {
            error ?
                _error(`[mongo] ${error.message}`) :
                info('[mongo] Connected to databse !');
        }
    );
}

connectMongo();