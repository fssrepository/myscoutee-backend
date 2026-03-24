(function() {
  const portalDb = db.getSiblingDB('myscoutee_db');

  const PROFILES = [
    { frontendId: 'u1', id: '00000000-0000-0000-0000-000000000001', name: 'Farkas Anna', gender: 'woman' },
    { frontendId: 'u2', id: '00000000-0000-0000-0000-000000000002', name: 'Kiss Balazs', gender: 'man' },
    { frontendId: 'u3', id: '00000000-0000-0000-0000-000000000003', name: 'Nagy Eszter', gender: 'woman' },
    { frontendId: 'u4', id: '00000000-0000-0000-0000-000000000004', name: 'Maya Stone', gender: 'woman' },
    { frontendId: 'u5', id: '00000000-0000-0000-0000-000000000005', name: 'Lina Park', gender: 'woman' },
    { frontendId: 'u6', id: '00000000-0000-0000-0000-000000000006', name: 'Iris Bloom', gender: 'woman' },
    { frontendId: 'u7', id: '00000000-0000-0000-0000-000000000007', name: 'Noah Hart', gender: 'man' },
    { frontendId: 'u8', id: '00000000-0000-0000-0000-000000000008', name: 'Evan Reed', gender: 'man' },
    { frontendId: 'u10', id: '00000000-0000-0000-0000-00000000000a', name: 'Luca Hale', gender: 'man' },
    { frontendId: 'u11', id: '00000000-0000-0000-0000-00000000000b', name: 'Theo Lane', gender: 'man' },
    { frontendId: 'u12', id: '00000000-0000-0000-0000-00000000000c', name: 'Milo Grant', gender: 'man' }
  ];

  const CHATS = [
    {
      ownerFrontendUserId: 'u1',
      chatId: 'c1',
      eventId: '00000000-0000-0000-0000-0000000000c1',
      avatar: 'MS',
      title: 'Driver Split - Alpine Weekend',
      lastMessage: 'I can take one extra seat from downtown pickup.',
      lastSenderId: 'u5',
      unread: 5,
      memberIds: ['u5', 'u4', 'u10', 'u7'],
      messageIds: [
        '00000000-0000-0000-0000-000000000101',
        '00000000-0000-0000-0000-000000000102',
        '00000000-0000-0000-0000-000000000103',
        '00000000-0000-0000-0000-000000000104',
        '00000000-0000-0000-0000-000000000105'
      ]
    },
    {
      ownerFrontendUserId: 'u1',
      chatId: 'c2',
      eventId: '00000000-0000-0000-0000-0000000000c2',
      avatar: 'NH',
      title: 'Padel Night Pair Room',
      lastMessage: 'Pair mode starts in 20 mins.',
      lastSenderId: 'u7',
      unread: 2,
      memberIds: ['u7', 'u6', 'u10', 'u3', 'u11'],
      messageIds: [
        '00000000-0000-0000-0000-000000000201',
        '00000000-0000-0000-0000-000000000202',
        '00000000-0000-0000-0000-000000000203',
        '00000000-0000-0000-0000-000000000204',
        '00000000-0000-0000-0000-000000000205'
      ]
    },
    {
      ownerFrontendUserId: 'u1',
      chatId: 'c3',
      eventId: '00000000-0000-0000-0000-0000000000c3',
      avatar: 'LH',
      title: 'Host Circle Ops',
      lastMessage: '2 invites timed out. Should we rerun now?',
      lastSenderId: 'u10',
      unread: 1,
      memberIds: ['u10', 'u12', 'u8'],
      messageIds: [
        '00000000-0000-0000-0000-000000000301',
        '00000000-0000-0000-0000-000000000302',
        '00000000-0000-0000-0000-000000000303',
        '00000000-0000-0000-0000-000000000304',
        '00000000-0000-0000-0000-000000000305'
      ]
    },
    {
      ownerFrontendUserId: 'u2',
      chatId: 'c4',
      eventId: '00000000-0000-0000-0000-0000000000c4',
      avatar: 'IB',
      title: 'City Brunch - Main Room',
      lastMessage: 'Table booked for 12:30.',
      lastSenderId: 'u6',
      unread: 2,
      memberIds: ['u6', 'u4', 'u1'],
      messageIds: [
        '00000000-0000-0000-0000-000000000401',
        '00000000-0000-0000-0000-000000000402',
        '00000000-0000-0000-0000-000000000403',
        '00000000-0000-0000-0000-000000000404',
        '00000000-0000-0000-0000-000000000405'
      ]
    },
    {
      ownerFrontendUserId: 'u3',
      chatId: 'c5',
      eventId: '00000000-0000-0000-0000-0000000000c5',
      avatar: 'LP',
      title: 'Trail Group - Transport',
      lastMessage: 'Need one more car seat.',
      lastSenderId: 'u5',
      unread: 4,
      memberIds: ['u5', 'u7', 'u10', 'u1'],
      messageIds: [
        '00000000-0000-0000-0000-000000000501',
        '00000000-0000-0000-0000-000000000502',
        '00000000-0000-0000-0000-000000000503',
        '00000000-0000-0000-0000-000000000504',
        '00000000-0000-0000-0000-000000000505'
      ]
    }
  ];

  const PROFILE_BY_FRONTEND_ID = Object.fromEntries(PROFILES.map(profile => [profile.frontendId, profile]));

  function juuid(value) {
    return JUUID(value);
  }

  function profileRef(frontendId) {
    return DBRef('profiles', juuid(PROFILE_BY_FRONTEND_ID[frontendId].id));
  }

  function unique(values) {
    const seen = {};
    const result = [];
    values.forEach(value => {
      if (!value || seen[value]) {
        return;
      }
      seen[value] = true;
      result.push(value);
    });
    return result;
  }

  function hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return Math.abs(hash);
  }

  function anchorDate(chat) {
    const seed = hashText('chat-date:' + chat.ownerFrontendUserId + ':' + chat.chatId + ':' + chat.title);
    const value = new Date('2026-02-21T09:00:00Z');
    value.setUTCDate(value.getUTCDate() + (seed % 9));
    value.setUTCHours(8 + (seed % 11), (seed % 4) * 15, 0, 0);
    return value;
  }

  function participants(chat) {
    return unique([chat.ownerFrontendUserId].concat(chat.memberIds));
  }

  function buildMessages(chat) {
    const chatParticipants = participants(chat);
    const memberA = chat.memberIds[0] || chat.ownerFrontendUserId;
    const memberB = chat.memberIds[1] || chat.lastSenderId || chat.ownerFrontendUserId;
    const memberC = chat.memberIds[2] || chat.ownerFrontendUserId;
    const anchor = anchorDate(chat);
    const minutesBefore = minutes => new Date(anchor.getTime() - minutes * 60 * 1000);
    const texts = [
      'Let us align the plan for ' + chat.title + '.',
      'I can bring two more people.',
      'Route and timing look good on my side.',
      chat.lastMessage,
      'Perfect, locking this in.'
    ];
    const senders = [memberA, memberB, memberC, chat.lastSenderId, chat.ownerFrontendUserId];
    const offsets = [180, 140, 95, 48, 12];

    return chat.messageIds.map((messageId, index) => ({
      _id: juuid(messageId),
      from: juuid(PROFILE_BY_FRONTEND_ID[senders[index]].id),
      tos: chatParticipants.map(frontendId => juuid(PROFILE_BY_FRONTEND_ID[frontendId].id)),
      eventId: juuid(chat.eventId),
      type: 'p',
      value: texts[index],
      createdDate: minutesBefore(offsets[index]),
      ref: juuid(messageId)
    }));
  }

  PROFILES.forEach(profile => {
    portalDb.profiles.replaceOne(
      { _id: juuid(profile.id) },
      {
        _id: juuid(profile.id),
        firstName: profile.name,
        gender: profile.gender,
        status: 'A',
        createdDate: new Date('2026-02-01T08:00:00Z'),
        updatedDate: new Date('2026-02-01T08:00:00Z')
      },
      { upsert: true }
    );
  });

  portalDb.users.replaceOne(
    { _id: juuid('00000000-0000-0000-0000-00000000d001') },
    {
      _id: juuid('00000000-0000-0000-0000-00000000d001'),
      email: 'dev@myscoutee.local',
      createdDate: new Date('2026-02-01T08:00:00Z'),
      profile: profileRef('u1'),
      profiles: [profileRef('u1')]
    },
    { upsert: true }
  );

  CHATS.forEach(chat => {
    const chatParticipants = participants(chat);
    const start = anchorDate(chat);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    portalDb.events.replaceOne(
      { _id: juuid(chat.eventId) },
      {
        _id: juuid(chat.eventId),
        name: chat.title,
        desc: 'Seeded from frontend demo chat data.',
        range: {
          start: start,
          end: end
        },
        status: 'A',
        type: 'E',
        createdDate: new Date('2026-02-01T08:00:00Z'),
        updatedDate: new Date('2026-02-01T08:00:00Z'),
        numOfMembers: chatParticipants.length,
        members: chatParticipants.map(frontendId => ({
          profile: profileRef(frontendId),
          status: 'A',
          role: 'U',
          createdDate: new Date('2026-02-01T08:00:00Z'),
          updatedDate: new Date('2026-02-01T08:00:00Z'),
          stageIdx: 0,
          score: 0.0
        }))
      },
      { upsert: true }
    );

    buildMessages(chat).forEach(message => {
      portalDb.messages.replaceOne({ _id: message._id }, message, { upsert: true });
    });
  });
})();
