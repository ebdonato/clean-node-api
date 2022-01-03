export interface AddSurveyModel {
    question: string
    answers: SurveyAnswerModel[]
}

export interface SurveyAnswerModel {
    image?: string
    answer: string
}

export interface AddSurvey {
    add(data: AddSurveyModel): Promise<void>
}
