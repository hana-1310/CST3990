const mongoose = require('mongoose')
const {ConnectDatabase} = require('../routes/database')

jest.mock('mongoose', () => {
    const mMock = {
        set: jest.fn(),
        connect: jest.fn(),
        Schema: class {},
        model: jest.fn()
    }
    return mMock
})

describe('ConnectDatabase', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should call mongoose.set and mongoose.connect with correct arguments', async () => {
        mongoose.connect.mockResolvedValueOnce()

        new ConnectDatabase('mongodb://mockurl')

        expect(mongoose.set).toHaveBeenCalledWith("strictQuery", false);
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://mockurl')
    });

    it('should log an error if connection fails', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const fakeError = new Error('Connection failed')

        mongoose.connect.mockRejectedValueOnce(fakeError)

        new ConnectDatabase('mongodb://mockurl')
        await new Promise(process.nextTick)

        expect(consoleSpy).toHaveBeenCalledWith('Unsuccessful Connection to database: ', fakeError)
        consoleSpy.mockRestore()
    })
})