

module.exports = {
  parties: function (db, params) {
    return [
      {
        title: 'foo',
        description: 'this is a RAD party',
        pictures: ['one.png', 'two.png'],
        required: [
          {title: 'six-pack', fullfilled: 3, needed: 4, contributorUserIds: [123, 456, 789]},
          {title: 'speaker', fullfilled: 2, needed: 2, contributorUserIds: [456, 789]},
          {title: 'bagels', fullfilled: 0, needed: 12, contributorUserIds: []}
        ]
      }
    ]
  }
}
