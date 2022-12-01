const mongoose = require('mongoose');

const FeedController = require('../src/controllers/feed');
const User = require('../src/models/user');
const Post = require('../src/models/post');

describe('FeedController - Post', () => {
  let user;

  beforeAll(() => {
    mongoose.connect('mongodb+srv://hyouka:leaf2201@cluster0.umlap.mongodb.net/test-messages?retryWrites=true&w=majority');
    user = new User({
      email: 'test@test.com',
      password: 'tester',
      name: 'test',
      posts: [],
      _id: '62e4f0538f2f5d99ba7a0dca',
    });
  });

  afterEach( () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should add a created post to the posts of the creator ', async () => {
    await user.save();
    const req = {
      body: {
        title: 'test title',
        content: 'test content',
      },
      file: {
        filename: 'test.jpg',
      },
      userId: '62e4f0538f2f5d99ba7a0dca',
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const savedUser = await FeedController.createPost(req, res, next);
    
    console.log(savedUser);
    // expect(savedUser).toHaveProperty('posts');
    //expect(savedUser.posts.length).toBe(1);
  });
});
