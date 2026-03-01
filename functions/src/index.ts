import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { WebClient } from '@slack/client'
import { QuizUser, UserListFetchResult } from './types'
import { activeNonBotMainUsersOnly } from './userFilter'

const config = defineSecret('SLACK_TOKEN')

function getSlackUsers(token: string): Promise<Array<QuizUser>> {
    const web = new WebClient(token)
    return web.users.list().then((result: UserListFetchResult) => {
        return activeNonBotMainUsersOnly(result)
    })
}

export const getUsers = onRequest(
    { secrets: [config] },
    (_req, res) => {
        return getSlackUsers(config.value()).then(userData => {
            res.send(userData)
        })
    },
)
