import { expect } from 'chai'
import 'mocha'
import { resolvePath } from '../src/table'

describe('functions', function() {
  describe('resolvePath', function() {
    it('should resolve a path containg just one element', function() {
      let value = resolvePath('a', { a: 'a1' })
      expect(value).to.equal('a1')
    })

    it('should resolve a path containing more than one element', function() {
      let value = resolvePath('a.b.c', { a: { b: { c: 'c1' }} })
      expect(value).to.equal('c1')
    })

    it('should return undefined if the path cannot be resolved', function() {
      let value = resolvePath('b', { a: 'a1' })
      expect(value).to.be.undefined

      value = resolvePath('a.b.d', { a: { b: { c: 'c1' }}})
      expect(value).to.be.undefined
    })
  })
})
