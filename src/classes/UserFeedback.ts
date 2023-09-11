import { State } from "../types/State"

export class UserFeedback {
    state: State = State.OpeningMove
    message: string = ''
    previousState: State = State.OpeningMove
    icon: "mdi-information" | "mdi-alert" | "mdi-check" | "mdi-star-face" | "mdi-head-question" = "mdi-information"
    color: string | "primary" | "error" | "success" | "info" = "primary"
    buttonText: "OK" | "Välj drag" | "Fortsätt" | "Börja om" = "OK"

    constructor() {
        this.setState(State.OpeningMove)
    }

    setState(newState: State, message?: string) {
        this.previousState = this.state
        this.state = newState
        switch (this.state) {
            case State.OpeningMove:
                this.message = "Välj öppningsdrag"
                this.icon = "mdi-information"
                this.color = "primary"
                this.buttonText = "Välj drag"
                break
            case State.CounterMove:
                this.message = "Välj motdrag"
                this.icon = "mdi-information"
                this.color = "primary"
                this.buttonText = "Välj drag"
                break
            case State.LineSaved:
                this.message = "Variant sparad"
                this.icon = "mdi-check"
                this.color = "info"
                this.buttonText = "OK"
                break
            case State.GuessMove:
                this.message = "Vilket drag spelar du nu?"
                this.icon = "mdi-head-question"
                this.color = "info"
                this.buttonText = "Välj drag"
                break
            case State.MoveNotInDb:
                this.message = "Draget finns ej i databasen"
                this.icon = "mdi-alert"
                this.color = "error"
                this.buttonText = "Välj drag"
                break
            case State.CorrectMove:
                this.message = "Rätt!"
                this.icon = "mdi-star-face"
                this.color = "success"
                this.buttonText = "Fortsätt"
                break
            case State.WrongMove:
                this.message = "Fel! Rätt drag var " + message
                this.icon = "mdi-alert"
                this.color = "error"
                this.buttonText = "Börja om"
                break
        }
    }
}