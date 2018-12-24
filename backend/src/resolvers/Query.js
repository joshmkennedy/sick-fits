const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils')
const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // check if there is a current user ID
        if (!ctx.request.userId) {
            return null;
        }

        return ctx.db.query.user(
            {
                where: { id: ctx.request.userId },
            },
            info
        );
    },
    async users(parent, args, ctx, info) {
        // 1. Check if they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }
        
        // 2. Check if the user has the permissions to query all the users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        // 2. if they do, query all the users!
        return ctx.db.query.users({}, info);
    },
    async order(parent, args, ctx, info){
        if (!ctx.request.userId) {
            throw new Error('You must be logged in!');
        }
        const order= await ctx.db.query.order({
            where:{
                id:args.id
            }
        }, info)

        const ownsOrder = order.user.id === ctx.request.userId
        const hasPermissonsTo = ctx.request.user.permissions.includes('ADMIN')
        if (!ownsOrder || !hasPermissonsTo) throw new Error('you cant see thes')

        return order
    },
    async orders(parent, args, ctx, info){
        const {userId} = ctx.request
        if(!userId){
            throw new Error('You must be logged in to see your orders')
        }
        return ctx.db.query.orders({
            where:{
                user:{id:userId}
            }
        }, info)
    }
    
};


module.exports = Query;
