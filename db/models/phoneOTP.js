const {Model} = require('objection')

class PhoneOTP extends Model{
    static get tableName(){
        return 'phoneotp';
    }
}

module.exports = PhoneOTP