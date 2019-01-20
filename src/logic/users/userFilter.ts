import {UserListFetchResult, UserListMember} from "./types"
import {QuizUser} from "../quiz/types"

function getBiggestImageUrl(user: UserListMember): string {
    return user.profile.image_1024
        || user.profile.image_512
        || user.profile.image_192
        || user.profile.image_72
        || user.profile.image_48
        || user.profile.image_32
        || user.profile.image_24
}

export function activeNonBotMainUsersOnly(userList: UserListFetchResult): Array<QuizUser> {
    return userList.members
        .filter((u: UserListMember) => !u.deleted)
        .filter((u: UserListMember) => !u.is_bot)
        .filter((u: UserListMember) => !u.is_restricted)
        .filter((u: UserListMember) => u.name !== 'slackbot')
        .map((u: UserListMember) => ({
            id: u.id,
            imageUrl: getBiggestImageUrl(u),
            nickname: u.profile.display_name,
            firstName: u.profile.first_name
        }))
}
