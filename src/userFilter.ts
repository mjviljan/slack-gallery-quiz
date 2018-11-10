import {QuizUser, UserListFetchResult, UserListMember} from "./types"

export function activeNonBotMainUsersOnly(userList: UserListFetchResult): Array<QuizUser> {
    return userList.members
        .filter((u: UserListMember) => !u.deleted)
        .filter((u: UserListMember) => !u.is_bot)
        .filter((u: UserListMember) => !u.is_restricted)
        .filter((u: UserListMember) => u.name !== 'slackbot')
        .map((u: UserListMember) => ({
            imageUrl: u.profile.image_24,
            nickname: u.profile.display_name,
            firstName: u.profile.first_name
        }))
}
