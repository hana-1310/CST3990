const {fileValidation} = require('../routes/extract_from_image')

describe('fileValidation', () => {
    test('accepts a valid PDF file', () => {
        const file = { mimetype: 'application/pdf' }
        const mockCb = jest.fn()

        fileValidation({}, file, mockCb)

        expect(mockCb).toHaveBeenCalledWith(null, true)
    })

    test('rejects an unsupported file type', () => {
        const file = { mimetype: 'image/jpeg' }
        const mockCb = jest.fn()

        fileValidation({}, file, mockCb)

        expect(mockCb).toHaveBeenCalledWith(expect.any(Error), false)
        expect(mockCb.mock.calls[0][0].message).toBe('unsupported')
    })
})
