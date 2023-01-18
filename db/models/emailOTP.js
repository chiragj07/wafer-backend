const {Model} = require('objection')

class EmailOTP extends Model{
    static get tableName(){
        return 'emailotp';
    }
}

module.exports = EmailOTP