const expect = require('expect');
const {generateMessage} = require('./message');

describe('Generate Message',()=>{
    it('should generate correct message object',()=>{
        var from ='Maede';
        var text = 'Text Message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({from,text}));

    })
})
