import * as functions from 'firebase-functions';
import { WebClient } from "@slack/client"
import { QuizUser, UserListFetchResult } from "./types"
import { activeNonBotMainUsersOnly } from "./userFilter"

function getSlackUsers(token: string): Promise<Array<QuizUser>> {
    const web = new WebClient(token)
    return web.users.list()
        .then((result: UserListFetchResult) => {
            return activeNonBotMainUsersOnly(result)
        })
}

export const getUsers = functions.https.onRequest((request: functions.Request, response) => {
    return getSlackUsers(functions.config().slack.token)
        .then(userData => {
            response.send(userData)
        })
})
