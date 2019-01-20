import {QuizUser} from "../src/logic/quiz/types"
import {activeNonBotMainUsersOnly} from "../src/logic/users/userFilter"

const fakeUsers = require('./test_data.json')

describe('UserFilter', () => {
    it('should return only active, non-bot, non-guest users (count)', () => {
        const users: Array<QuizUser> = activeNonBotMainUsersOnly(fakeUsers)
        expect(users.length).toEqual(2)
    })

    it('should return only active, non-bot, non-guest users (IDs)', () => {
        const users: Array<QuizUser> = activeNonBotMainUsersOnly(fakeUsers)
        expect(users.map(u => u.id)).toEqual(["FAKEUID01", "FAKEUID02"])
        expect(users.map(u => u.nickname)).toEqual(["jamie", "dude"])
        expect(users.map(u => u.firstName)).toEqual(["Jamie", "Dude"])
    })

    it('should return image URL of as big an image as possible', () => {
        const users: Array<QuizUser> = activeNonBotMainUsersOnly(fakeUsers)
        expect(users.map(u => u.imageUrl)).toEqual([
            "https://i1.wp.com/a.slack-edge.com/7fa9/img/avatars/ava_0001-192.png",
            "https://i1.wp.com/a.slack-edge.com/7fa9/img/avatars/ava_0002-512.png"
        ])
    })
})
