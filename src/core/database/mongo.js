// import { error as _error, info } from '../logger';
import logger from '../logger';
import { connect } from 'mongoose';
import { MONGO_URL } from '../config';

module.exports = () => {
    connect(
        MONGO_URL, 
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        (error) => {
            error ?
                logger.error(`[mongo] ${error.message}`) :
                logger.info('[mongo] Connected to databse !');
        }
    );
}

// const connectMongo = () => {
//     connect(MONGO_URL, {
//             useNewUrlParser: true,
//             useFindAndModify: false,
//             useUnifiedTopology: true,
//         },
//         (error) => {
//             error ?
//                 logger.error(`[mongo] ${error.message}`) :
//                 logger.info('[mongo] Connected to databse !');
//         }
//     );
// }

// connectMongo();