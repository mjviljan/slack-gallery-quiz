export type QuizUser = {
    id: string,
    imageUrl: string,
    nickname: string,
    firstName: string
}

export enum FilterSelection {
    ALL = "ALL",
    RND10 = "RND10",
    FAILURES = "FAILURES"
}