class CustomLogger {
    constructor(namespace) {
        this.namespace = namespace
    }

    _getTimeStamp() {
        return new Date().toISOString()
    }

    _printMessage(messageType, message, object) {
        if (object) {
            console.log(
                `[${this._getTimeStamp()}][${messageType}][${
                    this.namespace
                }] ${message}`,
                object
            )
        } else {
            console.log(
                `[${this._getTimeStamp()}][${messageType}][${
                    this.namespace
                }] ${message}`
            )
        }
    }

    info(message, object) {
        this._printMessage('INFO', message, object)
    }

    warn(message, object) {
        this._printMessage('WARN', message, object)
    }

    debug(message, object) {
        this._printMessage('DEBUG', message, object)
    }

    error(message, object) {
        this._printMessage('ERROR', message, object)
    }
}

module.exports = CustomLogger
