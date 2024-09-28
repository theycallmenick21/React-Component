/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest'

import { flattenNestedData, formatURL, generateGUID, getCookie, isEmpty, setCookie } from './common'

describe('getCookie', () => {
    beforeEach(() => {
        // Mock the document.cookie property
        Object.defineProperty(document, 'cookie', {
            value: '  key1=value1',
            writable: true,
        })
    })
    it('should return the cookie value correctly', () => {
        // arrange
        const key = 'key1'
        const expectedResult = 'value1'

        // act
        const result = getCookie(key)

        // assert
        expect(result).toBe(expectedResult)
    })
    it('should return empty string when cookie does not exist', () => {
        // arrange
        const key = 'invalidKey'

        // act
        const result = getCookie(key)

        // assert
        expect(result).toBe('')
    })
})

describe('setCookie', () => {
    beforeEach(() => {
        Object.defineProperty(document, 'cookie', {
            value: '',
            writable: true,
        })
    })
    it('should set the cookie correctly with expiration date', () => {
        // arrange
        const key = 'key1'
        const value = 'value1'
        const d = new Date()
        d.setTime(d.getTime())
        const expires = `expires=${d.toUTCString()};path=/;`
        const expectedResult = `${key}=${value};${expires}`

        // act
        setCookie(key, value)

        // assert
        expect(document.cookie).toBe(expectedResult)
    })
    it('should set the cookie correctly without expiration date when invalid expiration is provided', () => {
        // arrange
        const key = 'key1'
        const value = 'value1'
        const expectedResult = `${key}=${value};`

        // act
        setCookie(key, value, -1)

        // assert
        expect(document.cookie).toBe(expectedResult)
    })
})

describe('generateGUID', () => {
    it('should return GUID format correctly', () => {
        // act
        const result = generateGUID()

        // assert
        expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })
})

describe('isEmpty', () => {
    it('should return true when value is empty', () => {
        // arrange
        const value = ''

        // act
        const result = isEmpty(value)

        // assert
        expect(result).toBe(true)
    })
    it('should return true when value is null', () => {
        // arrange
        const value = null

        // act
        const result = isEmpty(value as any)

        // assert
        expect(result).toBe(true)
    })
    it('should return true when value is undefined', () => {
        // arrange
        const value = undefined

        // act
        const result = isEmpty(value as any)

        // assert
        expect(result).toBe(true)
    })
    it('should return true when value is "undefined"', () => {
        // arrange
        const value = 'undefined'

        // act
        const result = isEmpty(value)

        // assert
        expect(result).toBe(true)
    })
    it('should return true when value is "empty"', () => {
        // arrange
        const value = 'empty'

        // act
        const result = isEmpty(value)

        // assert
        expect(result).toBe(true)
    })
    it('should return false when value is not empty', () => {
        // arrange
        const value = 'value'

        // act
        const result = isEmpty(value)

        // assert
        expect(result).toBe(false)
    })
})

describe('formatURL', () => {
    it('should return the URL correctly when it already has http', () => {
        // arrange
        const baseURL = 'http://localhost'
        const url = 'http://localhost:3000'
        const expectedResult = url

        // act
        const result = formatURL({ baseURL, url })

        // assert
        expect(result).toBe(expectedResult)
    })
    it('should return the URL correctly when it does not have http', () => {
        // arrange
        const baseURL = 'http://localhost'
        const url = '/test'
        const expectedResult = 'http://localhost/test'

        // act
        const result = formatURL({ baseURL, url })

        // assert
        expect(result).toBe(expectedResult)
    })
    it('should return the URL correctly when there are double slash', () => {
        // arrange
        const baseURL = 'http://localhost/'
        const url = '/test'
        const expectedResult = 'http://localhost/test'

        // act
        const result = formatURL({ baseURL, url })

        // assert
        expect(result).toBe(expectedResult)
    })
    it('should return the URL correctly when there is no slash', () => {
        // arrange
        const baseURL = 'http://localhost'
        const url = 'test'
        const expectedResult = 'http://localhost/test'

        // act
        const result = formatURL({ baseURL, url })

        // assert
        expect(result).toBe(expectedResult)
    })
})
describe('flattenNestedData', () => {
    it('should return the flatten array correctly', () => {
        // arrange
        const arr = [
            { children: [{ children: [{ children: [], id: 3, name: 'C' }], id: 2, name: 'B' }], id: 1, name: 'A' },
            { children: [], id: 4, name: 'D' },
        ]
        const childName = 'children'
        const expectedResult = [
            { children: [{ children: [{ children: [], id: 3, name: 'C' }], id: 2, name: 'B' }], id: 1, name: 'A' },
            { children: [{ children: [], id: 3, name: 'C' }], id: 2, name: 'B' },
            { children: [], id: 3, name: 'C' },
            { children: [], id: 4, name: 'D' },
        ]

        // act
        const result = flattenNestedData(arr, childName)

        // assert
        expect(result).toStrictEqual(expectedResult)
    })
    it('should return the flatten array correctly when there is no children', () => {
        // arrange
        const arr = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]
        const childName = 'children'
        const expectedResult = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]

        // act
        const result = flattenNestedData(arr, childName as any)

        // assert
        expect(result).toStrictEqual(expectedResult)
    })
    it('should return the flatten array correctly when there is no children and childName is not provided', () => {
        // arrange
        const arr = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]
        const childName = 'children'
        const expectedResult = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]

        // act
        const result = flattenNestedData(arr, childName as any)

        // assert
        expect(result).toStrictEqual(expectedResult)
    })
})
