var Schema = {
    members: {
        id: { type: 'increments', nullable: false, primary: true },
        member_id: { type: 'string', nullable: false},
        chid: { type: 'string', maxlength: 254, nullable: false },
        bid: { type: 'string', nullable: false },
        role_id: { type: 'string', nullable: false }
    },
    roles: {
        role_id: { type: 'string', nullable: false, primary: true },
        title: { type: 'string', nullable: false },
        desc: { type: 'string', nullable: false },
    },
    permissions: {
        id: { type: 'increments', nullable: false, primary: true },
        role_id: { type: 'string', nullable: false },
        title: { type: 'string', nullable: false },
        desc: { type: 'string', nullable: false },
    }
}

module.exports = Schema;