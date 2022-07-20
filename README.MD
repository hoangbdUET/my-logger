### custom daily rotate logger
```
const logger = require('h-logger')({service: 'myService', path: 'logs'})
logger.info('message', 'text' || object)
logger.info('message', 'text' || object)
```