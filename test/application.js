import { expect } from 'chai'
import request from 'supertest'
import kratos, { Kratos } from '../src'

describe('app', () => {
  it('should set development env when NODE_ENV is missing', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = ''
    expect(process.env.NODE_ENV).to.not.equal(NODE_ENV)
    expect(process.env.NODE_ENV).to.equal('')
    const app = kratos()
    expect(app.env).to.equal('development')
    process.env.NODE_ENV = NODE_ENV
  })

  it('should work with class constructor', () => {
    const app = new Kratos()
    expect(app).to.be.an('object')
  })

  it('should allow you to use a single middleware', () => {
    const app = kratos()

    app.use(function * () {
      this.test = true
    })

    app.use(function * () {
      expect(this.text).to.be.true
    })
  })

  it('should allow you to use spread singleware', () => {
    const app = kratos()

    const middlewareOne = function * () {
      this.one = true
    }

    const middlewareTwo = function * () {
      this.two = true
    }

    app.use(middlewareOne, middlewareTwo)

    app.use(function * () {
      expect(this.one).to.be.true
      expect(this.two).to.be.true
    })
  })

  it('should serve hello world', () => {
    const response = 'hello world'
    const app = kratos()

    app.get('/', function * () {
      this.body = response
    })

    app.run()

    const req = request('http://localhost:1337')

    req.get('/')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.equal(response)
      })
  })

  it('should change port based on config object', () => {
    const response = 'hello world'
    const app = kratos({ app: { port: 3000 } })

    app.get('/', function * () {
      this.body = response
    })

    app.run()

    const req = request('http://localhost:3000')

    req.get('/')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.equal(response)
      })
  })

  it('should load config from directory', () => {
    const response = 'hello world'
    const app = kratos(__dirname + '/fixtures/config')

    app.get('/', function * () {
      this.body = response
    })

    app.run()

    const req = request('http://localhost:3000')

    req.get('/')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.equal(response)
      })
  })
})
