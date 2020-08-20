const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')

const events = eventIds => {
  return Event.find({_id: {$in: eventIds}})
  .then(events => {
    return events.map(event => {
      return { 
        ...event._doc,
         creator: user.bind(this, event.creator),
         date: new Date(event._doc.date).toISOString()
        };
    })
  })
  .catch(err => {
    throw err
  })
}

const user = userId => {
  return User.findById(userId)
  .then(user => {
    return {...user._doc, createdEvents: events.bind(this, user._doc.createdEvents)}
  })
  .catch(err => {
    throw err
  });
}

module.exports = {
  events: () => {
    return Event.find()
    .then(events => {
      return events.map(event => {
        return { 
          ...event._doc, 
          creator: user.bind(this, event._doc.creator),
          date: new Date(event._doc.date).toISOString()
        };
      })
    }).catch(err => {
      throw err
    })
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5f3d432173fb9d3b0edffcc0'
    });

    let createdEvent;

    return event
      .save()
      .then((res) => {
        createdEvent = { 
          ...res._doc, 
          creator: user.bind(this, res._doc.creator),
          date: new Date(event._doc.date).toISOString()
        }

        return User.findById('5f3d432173fb9d3b0edffcc0')
      })
      .then(user => {
        if (!user) {
          throw new Error("User doesn't axist");
        }
        user.createdEvents.push(event)
        return user.save()
      })
      .then(result => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User axist already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });

        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
  }
};