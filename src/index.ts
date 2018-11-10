import {WebClient} from "@slack/client"
import {QuizUser, UserListFetchResult} from "./types"
import {activeNonBotMainUsersOnly} from "./userFilter"

async function getUsers(token: string): Promise<Array<QuizUser>> {
    const web = new WebClient(token);
    return Promise.resolve(activeNonBotMainUsersOnly(await web.users.list() as UserListFetchResult))
}

(async () => {
    const token = process.env.SLACK_TOKEN;
    if (!token) {
        console.log("Slack API token missing. Set it in the environment variable SLACK_TOKEN.")
        return
    }

    console.log((await getUsers(token)).length)
})()
