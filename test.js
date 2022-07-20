const logger = require('./index')({service: 'WI_LOG'})
logger.info('Test')
logger.error('Test', {test: 'test'})