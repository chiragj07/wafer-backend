const {Model} = require('objection')

class emailOTP extends Model{
    static get tableName(){
        return 'emailotp';
    }
}

module.exports = emailOTP