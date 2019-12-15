class ActionTokens {

    createAlphanumeric(p1, p2, p3, p4, p5, p6, p7) {
        return '123';
    }

    use(p1, p2, p3) {
        return {
            status: 'success',
            payload: {
                bid: '123',
                added_by: 'me',
                title: 'Awesome title',
                desc: 'Short desc'
            }
        };
    }
}

module.exports = ActionTokens;