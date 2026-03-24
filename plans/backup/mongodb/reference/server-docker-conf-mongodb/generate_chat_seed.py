#!/usr/bin/env python3
import base64
import json
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path('/home/raxim/workspace/myscoutee-backend/server/docker/conf/mongodb')
DATA_DIR = ROOT / 'myscoutee_db'
GROUP_ID = '00000000-0000-0000-0000-00000000a001'
CREATED_AT = datetime(2026, 2, 1, 8, 0, 0, tzinfo=timezone.utc)

PROFILES = [
    {'frontendId': 'u1', 'profileId': '00000000-0000-0000-0000-000000000001', 'name': 'Farkas Anna', 'gender': 'woman', 'role': 'A'},
    {'frontendId': 'u2', 'profileId': '00000000-0000-0000-0000-000000000002', 'name': 'Kiss Balazs', 'gender': 'man', 'role': 'U'},
    {'frontendId': 'u3', 'profileId': '00000000-0000-0000-0000-000000000003', 'name': 'Nagy Eszter', 'gender': 'woman', 'role': 'U'},
    {'frontendId': 'u4', 'profileId': '00000000-0000-0000-0000-000000000004', 'name': 'Maya Stone', 'gender': 'woman', 'role': 'U'},
    {'frontendId': 'u5', 'profileId': '00000000-0000-0000-0000-000000000005', 'name': 'Lina Park', 'gender': 'woman', 'role': 'U'},
    {'frontendId': 'u6', 'profileId': '00000000-0000-0000-0000-000000000006', 'name': 'Iris Bloom', 'gender': 'woman', 'role': 'U'},
    {'frontendId': 'u7', 'profileId': '00000000-0000-0000-0000-000000000007', 'name': 'Noah Hart', 'gender': 'man', 'role': 'U'},
    {'frontendId': 'u8', 'profileId': '00000000-0000-0000-0000-000000000008', 'name': 'Evan Reed', 'gender': 'man', 'role': 'U'},
    {'frontendId': 'u10', 'profileId': '00000000-0000-0000-0000-00000000000a', 'name': 'Luca Hale', 'gender': 'man', 'role': 'U'},
    {'frontendId': 'u11', 'profileId': '00000000-0000-0000-0000-00000000000b', 'name': 'Theo Lane', 'gender': 'man', 'role': 'U'},
    {'frontendId': 'u12', 'profileId': '00000000-0000-0000-0000-00000000000c', 'name': 'Milo Grant', 'gender': 'man', 'role': 'U'}
]

CHATS = [
    {
        'ownerFrontendUserId': 'u1',
        'chatId': 'c1',
        'eventId': '00000000-0000-0000-0000-0000000000c1',
        'avatar': 'MS',
        'title': 'Driver Split - Alpine Weekend',
        'lastMessage': 'I can take one extra seat from downtown pickup.',
        'lastSenderId': 'u5',
        'unread': 5,
        'memberIds': ['u5', 'u4', 'u10', 'u7'],
        'messageIds': [
            '00000000-0000-0000-0000-000000000101',
            '00000000-0000-0000-0000-000000000102',
            '00000000-0000-0000-0000-000000000103',
            '00000000-0000-0000-0000-000000000104',
            '00000000-0000-0000-0000-000000000105'
        ]
    },
    {
        'ownerFrontendUserId': 'u1',
        'chatId': 'c2',
        'eventId': '00000000-0000-0000-0000-0000000000c2',
        'avatar': 'NH',
        'title': 'Padel Night Pair Room',
        'lastMessage': 'Pair mode starts in 20 mins.',
        'lastSenderId': 'u7',
        'unread': 2,
        'memberIds': ['u7', 'u6', 'u10', 'u3', 'u11'],
        'messageIds': [
            '00000000-0000-0000-0000-000000000201',
            '00000000-0000-0000-0000-000000000202',
            '00000000-0000-0000-0000-000000000203',
            '00000000-0000-0000-0000-000000000204',
            '00000000-0000-0000-0000-000000000205'
        ]
    },
    {
        'ownerFrontendUserId': 'u1',
        'chatId': 'c3',
        'eventId': '00000000-0000-0000-0000-0000000000c3',
        'avatar': 'LH',
        'title': 'Host Circle Ops',
        'lastMessage': '2 invites timed out. Should we rerun now?',
        'lastSenderId': 'u10',
        'unread': 1,
        'memberIds': ['u10', 'u12', 'u8'],
        'messageIds': [
            '00000000-0000-0000-0000-000000000301',
            '00000000-0000-0000-0000-000000000302',
            '00000000-0000-0000-0000-000000000303',
            '00000000-0000-0000-0000-000000000304',
            '00000000-0000-0000-0000-000000000305'
        ]
    },
    {
        'ownerFrontendUserId': 'u2',
        'chatId': 'c4',
        'eventId': '00000000-0000-0000-0000-0000000000c4',
        'avatar': 'IB',
        'title': 'City Brunch - Main Room',
        'lastMessage': 'Table booked for 12:30.',
        'lastSenderId': 'u6',
        'unread': 2,
        'memberIds': ['u6', 'u4', 'u1'],
        'messageIds': [
            '00000000-0000-0000-0000-000000000401',
            '00000000-0000-0000-0000-000000000402',
            '00000000-0000-0000-0000-000000000403',
            '00000000-0000-0000-0000-000000000404',
            '00000000-0000-0000-0000-000000000405'
        ]
    },
    {
        'ownerFrontendUserId': 'u3',
        'chatId': 'c5',
        'eventId': '00000000-0000-0000-0000-0000000000c5',
        'avatar': 'LP',
        'title': 'Trail Group - Transport',
        'lastMessage': 'Need one more car seat.',
        'lastSenderId': 'u5',
        'unread': 4,
        'memberIds': ['u5', 'u7', 'u10', 'u1'],
        'messageIds': [
            '00000000-0000-0000-0000-000000000501',
            '00000000-0000-0000-0000-000000000502',
            '00000000-0000-0000-0000-000000000503',
            '00000000-0000-0000-0000-000000000504',
            '00000000-0000-0000-0000-000000000505'
        ]
    }
]

PROFILE_BY_FRONTEND_ID = {profile['frontendId']: profile for profile in PROFILES}


def java_legacy_uuid(uuid_text: str) -> dict:
    raw = uuid.UUID(uuid_text).bytes
    legacy = raw[:8][::-1] + raw[8:][::-1]
    return {'$binary': base64.b64encode(legacy).decode('ascii'), '$type': '03'}


def db_ref(collection: str, uuid_text: str) -> dict:
    return {'$ref': collection, '$id': java_legacy_uuid(uuid_text)}


def ejson_date(value: datetime) -> dict:
    return {'$date': value.astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')}


def hash_text(value: str) -> int:
    result = 0
    for character in value:
        result = (result * 31 + ord(character)) % 104729
    return abs(result)


def anchor_date(chat: dict) -> datetime:
    seed = hash_text(f"chat-date:{chat['ownerFrontendUserId']}:{chat['chatId']}:{chat['title']}")
    value = datetime(2026, 2, 21, 9, 0, 0, tzinfo=timezone.utc)
    value += timedelta(days=seed % 9)
    value = value.replace(hour=8 + (seed % 11), minute=(seed % 4) * 15)
    return value


def unique(values):
    result = []
    for value in values:
        if value and value not in result:
            result.append(value)
    return result


def participants(chat: dict):
    return unique([chat['ownerFrontendUserId'], *chat['memberIds']])


def build_messages(chat: dict):
    chat_participants = participants(chat)
    member_a = chat['memberIds'][0] if chat['memberIds'] else chat['ownerFrontendUserId']
    member_b = chat['memberIds'][1] if len(chat['memberIds']) > 1 else chat['lastSenderId'] or chat['ownerFrontendUserId']
    member_c = chat['memberIds'][2] if len(chat['memberIds']) > 2 else chat['ownerFrontendUserId']
    anchor = anchor_date(chat)
    texts = [
        f"Let us align the plan for {chat['title']}.",
        'I can bring two more people.',
        'Route and timing look good on my side.',
        chat['lastMessage'],
        'Perfect, locking this in.'
    ]
    senders = [member_a, member_b, member_c, chat['lastSenderId'], chat['ownerFrontendUserId']]
    offsets = [180, 140, 95, 48, 12]
    records = []
    for index, message_id in enumerate(chat['messageIds']):
        records.append({
            '_id': java_legacy_uuid(message_id),
            'from': java_legacy_uuid(PROFILE_BY_FRONTEND_ID[senders[index]]['profileId']),
            'tos': [java_legacy_uuid(PROFILE_BY_FRONTEND_ID[frontend_id]['profileId']) for frontend_id in chat_participants],
            'eventId': java_legacy_uuid(chat['eventId']),
            'type': 'p',
            'value': texts[index],
            'ref': java_legacy_uuid(message_id),
            'createdDate': ejson_date(anchor - timedelta(minutes=offsets[index]))
        })
    return records


def write_json(path: Path, payload):
    path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + '\n', encoding='utf-8')


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    profiles_payload = [
        {
            '_id': java_legacy_uuid(profile['profileId']),
            'firstName': profile['name'],
            'gender': profile['gender'],
            'group': java_legacy_uuid(GROUP_ID),
            'role': profile['role'],
            'status': 'A',
            'createdDate': ejson_date(CREATED_AT),
            'updatedDate': ejson_date(CREATED_AT)
        }
        for profile in PROFILES
    ]

    groups_payload = [
        {
            '_id': java_legacy_uuid(GROUP_ID),
            'name': 'Chat Dev',
            'status': 'A',
            'type': 'i',
            'system': True,
            'createdDate': ejson_date(CREATED_AT)
        }
    ]

    users_payload = [
        {
            '_id': java_legacy_uuid('00000000-0000-0000-0000-00000000d001'),
            'email': 'dev@myscoutee.local',
            'createdDate': ejson_date(CREATED_AT),
            'group': java_legacy_uuid(GROUP_ID),
            'profile': db_ref('profiles', PROFILE_BY_FRONTEND_ID['u1']['profileId']),
            'profiles': [db_ref('profiles', PROFILE_BY_FRONTEND_ID['u1']['profileId'])]
        }
    ]

    events_payload = []
    messages_payload = []
    for chat in CHATS:
        chat_participants = participants(chat)
        start_at = anchor_date(chat)
        end_at = start_at + timedelta(hours=2)
        events_payload.append({
            '_id': java_legacy_uuid(chat['eventId']),
            'name': chat['title'],
            'desc': 'Seeded from frontend demo chat data.',
            'group': java_legacy_uuid(GROUP_ID),
            'range': {
                'start': ejson_date(start_at),
                'end': ejson_date(end_at)
            },
            'status': 'A',
            'type': 'E',
            'createdDate': ejson_date(CREATED_AT),
            'updatedDate': ejson_date(CREATED_AT),
            'numOfMembers': len(chat_participants),
            'members': [
                {
                    'profile': db_ref('profiles', PROFILE_BY_FRONTEND_ID[frontend_id]['profileId']),
                    'status': 'A',
                    'role': 'A' if frontend_id == chat['ownerFrontendUserId'] else 'U',
                    'createdDate': ejson_date(CREATED_AT),
                    'updatedDate': ejson_date(CREATED_AT),
                    'stageIdx': 0,
                    'score': 0.0
                }
                for frontend_id in chat_participants
            ]
        })
        messages_payload.extend(build_messages(chat))

    write_json(DATA_DIR / 'groups.json', groups_payload)
    write_json(DATA_DIR / 'profiles.json', profiles_payload)
    write_json(DATA_DIR / 'users.json', users_payload)
    write_json(DATA_DIR / 'events.json', events_payload)
    write_json(DATA_DIR / 'messages.json', messages_payload)


if __name__ == '__main__':
    main()
