import { State } from "../types/State"

export interface Feedback {
    message: string
    buttonText: string
}

export class UserFeedback {
    language: string = ''
    state: State = State.OpeningMove
    previousState = State.OpeningMove
    feedback: Feedback = { message: "", buttonText: "" }
    undoButtonText: string = ''
    moveButtonsToggleText: string = ''
    addMoveButtonText: string = ''
    selectLanguageText: string = ''
    icon: "mdi-information" | "mdi-alert" | "mdi-check" | "mdi-star-face" | "mdi-head-question" = "mdi-information"
    color: string | "primary" | "error" | "success" | "info" = "primary"
    

    constructor() {
        this.setState(State.OpeningMove)
        
    }

    setLanguage(language: string) {
        this.language = language
        this.language = language
        switch (language) {
            case 'sv':
                this.undoButtonText = 'Ångra drag'
                this.moveButtonsToggleText = 'Visa drag'
                this.selectLanguageText = 'Välj språk'
                this.addMoveButtonText = 'Lägg till fler'
                break
            case 'en':
                this.undoButtonText = "Undo move"
                this.moveButtonsToggleText = 'Show moves'
                this.selectLanguageText = 'Select language'
                this.addMoveButtonText = 'Add more moves'
                break
        }
    }

    generateMessage(state: State, message?: string ): Feedback {

        switch (this.language) {
            case "sv":
                switch (state) {
                    case State.OpeningMove:
                        return { message: "Välj öppningsdrag", buttonText: "Välj drag" }
                    case State.CounterMove:
                        return { message: "Välj motdrag", buttonText: "Lägg till" }
                    case State.LineSaved:
                        return { message: "Variant sparad", buttonText: "Fortsätt" }
                    case State.GuessMove:
                        return { message: "Vilket drag spelar du nu?", buttonText: "Välj drag" }
                    case State.MoveNotInDb:
                        return { message: "Draget finns ej i databasen", buttonText: "OK" }
                    case State.CorrectMove:
                        return { message: "Rätt!", buttonText: "Fortsätt" }
                    case State.WrongMove:
                        return { message: "Fel! Rätt drag var " + message, buttonText: "Börja om" }
                }
                break;
            case "en":
                switch (state) {
                    case State.OpeningMove:
                        return { message: "Choose opening move", buttonText: "Select move" }
                    case State.CounterMove:
                        return { message: "Choose counter move", buttonText: "Add move" }
                    case State.LineSaved:
                        return { message: "Line saved", buttonText: "Continue" }
                    case State.GuessMove:
                        return { message: "What move are you playing now?", buttonText: "Choose move" }
                    case State.MoveNotInDb:
                        return { message: "Move not in database", buttonText: "OK" }
                    case State.CorrectMove:
                        return { message: "Correct!", buttonText: "Continue" }
                    case State.WrongMove:
                        return { message: "Wrong! Correct move was " + message, buttonText: "Start over" }
                }
                break;
        }
        return { message: '', buttonText: '' }
    }


    setState(newState: State, message?: string) {
        this.previousState = this.state
        this.state = newState
        this.feedback = this.generateMessage(newState, message)
        switch (this.state) {
            case State.OpeningMove:
                this.icon = "mdi-information"
                this.color = "primary"
                break
            case State.CounterMove:
                this.icon = "mdi-information"
                this.color = "primary"
                break
            case State.LineSaved:
                this.icon = "mdi-check"
                this.color = "info"
                break
            case State.GuessMove:
                this.icon = "mdi-head-question"
                this.color = "info"
                break
            case State.MoveNotInDb:
                this.icon = "mdi-alert"
                this.color = "error"
                break
            case State.CorrectMove:
                this.icon = "mdi-star-face"
                this.color = "success"
                break
            case State.WrongMove:
                this.icon = "mdi-alert"
                this.color = "error"
                break
        }
    }
}