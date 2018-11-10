import {QuizUser} from "../src/types"
import {activeNonBotMainUsersOnly} from "../src/userFilter"

const fakeUsers = require('./test_data.json')

describe('UserFilter', () => {
    it('should return only active, non-bot, non-guest users (count)', () => {
        const users: Array<QuizUser> = activeNonBotMainUsersOnly(fakeUsers)
        expect(users.length).toEqual(2)
    })

    it('should return only active, non-bot, non-guest users (IDs)', () => {
        const users: Array<QuizUser> = activeNonBotMainUsersOnly(fakeUsers)
        expect(users.map(u => u.nickname)).toEqual(["jamie", "dude"])
    })
})
