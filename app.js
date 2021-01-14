const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const applySwaggerDocs = require('./apply-swagger-docs');
const Link = require('./models/Link');
const CronJob = require('cron').CronJob;
const CustomLogger = require('./modules/custom-logger');
const logger = new CustomLogger('app.js');

const app = express();
applySwaggerDocs(app);

const PORT = config.get('port') || 5000;

/** Logging the request */
app.use((req, res, next) => {
    logger.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.info(`METHOD - [${req.method}], URL - [${req.url}, IP - {${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

//configure json bodies
app.use(express.json({ extended: true }));
app.use(require('./routes'));

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (err) {
        logger.info('Server Error', err.message);
        process.exit(1);
    }
}

//Outdated links clear
//This job deletes only links from database
//We don't need to use job for clearing outdated cached links
//as links will be deleted when expired
let job = new CronJob(
    '0 0 0 * * *',
    function () {
        logger.info('Outdated links deleting...');
        let moment = require('moment');
        let olderThan = moment().subtract(config.get('deleteLinkAfterDays'), 'days').toDate();

        Link.find({ date: { $lte: olderThan } })
            .remove()
            .exec()
            .then(() => {
                logger.info('Outdated links removed successfully');
            })
            .catch((err) => {
                logger.error('error on ', err);
            });
    },
    null,
    true
);
job.start();

start();

app.listen(PORT, () => logger.info(`App started on port: ${PORT}`));
