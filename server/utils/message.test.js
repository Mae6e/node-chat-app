const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('Generate Message',()=>{
    it('should generate correct message object',()=>{
        var from ='Maede';
        var text = 'Text Message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({from,text}));

    })
})


describe('Generate Location Message',()=>{
    it('should generate correct location message object',()=>{
        var latitude = 15;
        var longitude = 39;
        var from = 'Maede';
        var url = `https://www.google.com/maps?q=15,39`;

        var message = generateLocationMessage(from, latitude,longitude);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({from,url}))
    })
})