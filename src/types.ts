import {WebAPICallResult} from "@slack/client"

export type UserListMember = {
    deleted: boolean,
    is_bot: boolean,
    is_restricted: boolean,
    name: string,
    profile: {
        display_name: string,
        image_24: string,
        image_32: string, // optional
        image_48: string, // optional
        image_72: string, // optional
        image_192: string, // optional
        image_512: string, // optional
        image_1024: string, // optional
        image_original: string // optional
    }
}

export type UserListFetchResult = WebAPICallResult & {
    members: Array<UserListMember>
}

export type QuizUser = {
    nickname: string,
    imageUrl: string
}