import { expect } from 'chai'
import 'mocha'
import { extractValue } from '../src/table'

describe('functions', function() {
  describe('extractValue', function() {
    it('should resolve a path containg just one element', function() {
      let value = extractValue('a', { a: 'a1' })
      expect(value).to.equal('a1')
    })

    it('should resolve a path containing more than one element', function() {
      let value = extractValue('a.b.c', { a: { b: { c: 'c1' }} })
      expect(value).to.equal('c1')
    })

    it('should return undefined if the path cannot be resolved', function() {
      let value = extractValue('b', { a: 'a1' })
      expect(value).to.be.undefined

      value = extractValue('a.b.d', { a: { b: { c: 'c1' }}})
      expect(value).to.be.undefined
    })
  })
})
