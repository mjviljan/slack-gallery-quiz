export type QuizUser = {
    id: string
    imageUrl: string
    nickname: string
    firstName: string
}

export enum FilterSelection {
    ALL = 'ALL',
    NEWEST10 = 'NEWEST10',
    NEWEST25 = 'NEWEST25',
    RND10 = 'RND10',
    FAILURES = 'FAILURES',
}
