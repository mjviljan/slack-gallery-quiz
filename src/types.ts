import {WebAPICallResult} from "@slack/client"

export type UserListMember = {
    deleted: boolean,
    is_bot: boolean,
    is_restricted: boolean,
    name: string,
    profile: {
        display_name: string,
        first_name: string,
        image_24: string,
        image_32?: string,
        image_48?: string,
        image_72?: string,
        image_192?: string,
        image_512?: string,
        image_1024?: string,
        image_original?: string
    }
}

export type UserListFetchResult = WebAPICallResult & {
    members: Array<UserListMember>
}

export type QuizUser = {
    imageUrl: string,
    nickname: string,
    firstName: string
}