const userCollection = require('../db/user')
const roleCollection = require('../db/role')
const rightCollection = require('../db/right')
const lodash = require('lodash')

async function checkRight (ctx, next) {
    try {
        if (['/user/login', '/user/logout', '/user/register', '/user/userInfo'].includes(ctx.path)) await next()
        else {
            const userInfo = ctx.userInfo

            const user = await userCollection.findOne({ userId: userInfo.userId })
            const role = await roleCollection.findOne({ roleId: user.roleId  })
            const rightIds = role.rightIds || []
            const rights = await rightCollection.find({ rightId: { $in: rightIds } }).toArray()
            const avaluePaths = lodash.map(rights, 'path')
    
            if (avaluePaths.includes(ctx.path)) await next()
            else {       
                ctx.body = { code: -1, message: `无${ctx.path}权限` }
                return
            }
        }
    } catch (err) {
        console.log('checkRight异常:', err)
        ctx.body = { code: -1, message: 'checkRight异常' }
    }
}

module.exports = {
    checkRight
}
