import { expect } from 'chai'
import kratos from '../src'

describe('app', () => {
  it('should set development env when NODE_ENV is missing', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = ''
    expect(process.env.NODE_ENV).to.not.equal(NODE_ENV)
    expect(process.env.NODE_ENV).to.equal('')
    const app = kratos()
    expect(app.env).to.equal('development')
  })
})
