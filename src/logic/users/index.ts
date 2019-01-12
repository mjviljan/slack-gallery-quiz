import {WebClient} from "@slack/client"
import {UserListFetchResult} from "./types"
import {QuizUser} from "../quiz/types"
import {activeNonBotMainUsersOnly} from "./userFilter"

async function getSlackUsers(token: string): Promise<Array<QuizUser>> {
    const web = new WebClient(token);
    return Promise.resolve(activeNonBotMainUsersOnly(await web.users.list() as UserListFetchResult))
}

export const getUsers = async (): Promise<Array<QuizUser>> => {
    const token = process.env.SLACK_TOKEN;
    if (!token) {
        throw new Error("No Slack token given. Cannot proceed.")
    }

    return await getSlackUsers(token)
}