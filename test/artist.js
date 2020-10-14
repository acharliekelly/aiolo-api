// import mongoose from 'mongoose';
// import { should } from 'chai';

import server from '../server';
import Artist from '../app/models/artist';

process.env.TESTENV = true

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();

chai.use(chaiHttp);

const bobRoss = {
  name: 'Bob Ross',
  living: false,
  birthYear: 1942,
  deathYear: 1995,
  bio: 'TV host',
  gender: 'Male',
  nationality: 'American'
}

describe('Artists', () => {
  beforeEach(done => {
    Artist.deleteMany({})
      .then(() => Artist.create(bobRoss))
      .then(() => done())
      .catch(() => done())
  });

  after(done => {
    Artist.remove({})
      .then(() => done())
      .catch(() => done())
  });

  describe('GET /artists', () => {
    it('should get all the artists', done => {
      chai.request(server)
        .get('/artists')
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  });

  describe('GET /artists/:id', () => {
    it('should get the specified artist', done => {
      let artist = new Artist(bobRoss);
      artist.save((err, artist) => {
        if (err) console.log(err);
        chai.request(server)
          .get(`/artists/${artist._id}`)
          .send(artist)
          .end((err, res) => {
            if (err) console.log(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('birthYear');
            res.body.should.have.property('nationality');
            res.body.should.have.property('_id').eql(artist._id);
            done()
          })
      })
    })
  });

  describe('POST /artists', () => {
    it('should add a new artist', done => {
      chai.request(server)
        .post('/artists')
        .send(bobRoss)
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.artist.should.have.property('name');
          done();
        })
    })
  })

  // describe('PATCH /artists/:id', () => {

  // });

  // describe('DELETE /artists/:id', () => {

  // });
})
